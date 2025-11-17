from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import os
import json

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class User(BaseModel):
    email: str = Field(min_length=1, description="email cannot be empty.")
    password: str = Field(min_length=1, description="password cannot be empty.")
    admin: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str

class UserDataGet(BaseModel):
    email: str
    phone: str
    created_at: datetime
    last_login_at: datetime | None
    house_number: str
    street_number: str
    area: str
    city: str

class UserDataUpdate(BaseModel):
    phone: str | None
    house_number: str | None
    street_number: str | None
    area: str | None
    city: str | None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

async def get_access_token(token: str = Depends(oauth2_scheme)):
    return token

router = APIRouter()

@router.post("/register")
async def supa_register(user: User):
    metadata = {}
    if user.admin:
        metadata["admin"] = user.admin
    try:
        # Crear usuario en Supabase Auth
        response = supabase.auth.admin.create_user({"email" : user.email, "password" : user.password, "data" : metadata})
        print(response.user.id)
        
        # Bypass email confirmation
        _ = supabase.auth.admin.update_user_by_id(
            response.user.id, 
            {"email_confirm": True}
        )
        
        if response.user:
            # Crear dirección por defecto para el usuario
            default_address = {
                "city": "Not specified",
                "area": "Not specified",
                "street_number": 0,
                "house_number": 0
            }
            address_response = supabase.table('address').insert(default_address).execute()
            address_id = address_response.data[0]['id'] if address_response.data else None
            
            # Crear usuario en app_user
            user_type = "ADMIN" if user.admin else "CUSTOMER"
            new_user_data = {
                "id": response.user.id,
                "email": user.email,
                "first_name": metadata.get('first_name', 'Customer'),
                "last_name": metadata.get('last_name', ''),
                "type": user_type,
                "is_staff": user.admin is not None,
                "is_active": True,
                "address_id": address_id
            }
            supabase.table('app_user').insert(new_user_data).execute()
            print(f"User {response.user.id} created in app_user")
            
            return {"message": "User registered successfully"}
        else:            
            raise HTTPException(
                status_code=400,
                detail="Unexpected error during user registration"
            )
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=400, detail="Supabase error during registration")

@router.post("/login", response_model=TokenResponse)
async def supa_login(user: User):
    try:
        response = supabase.auth.sign_in_with_password({"email" : user.email, "password" : user.password})
        if response.user:
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                user_id=response.user.id
            )
        else:            
            raise HTTPException(
                status_code=400,
                detail="Unexpected error during user login"
            )
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=400, detail="Supabase error during login")

@router.post("/logout")
async def supa_logout(token: str = Depends(get_access_token)):
    try:
        response = supabase.auth.admin.sign_out(token)
        return {"message": "User logged out successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Supabase error during logout")

@router.post("/delete")
async def supa_delete(token: str = Depends(get_access_token)):
    try:
        print("a")
        _ = supabase.auth.admin.delete_user(token)
        return {"message": "User deleted successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=401, detail="Supabase error during deletion")

@router.get("/get_user", response_model=UserDataGet)
async def supa_get_user(token: str = Depends(get_access_token)):
    try:
        response = supabase.auth.get_user(token)
        return UserDataGet(
            email=response.user.email,
            phone=response.user.phone,
            created_at=response.user.created_at,
            last_login_at=response.user.last_sign_in_at,
            house_number=response.user.user_metadata.get('house_number', ''),
            street_number=response.user.user_metadata.get('street_number', ''),
            area=response.user.user_metadata.get('area', ''),
            city=response.user.user_metadata.get('city', '')
        )
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Supabase error during deletion")

@router.post("/update_user")
async def supa_update_user(userdata: UserDataUpdate, token: str = Depends(get_access_token), request: Request = None):
    try:
        refresh_token = request.headers.get("X-Refresh-Token")
    except:
        print(e)
        raise HTTPException(status_code=500, detail="No Refresh token given")
    try:
        supabase.auth.set_session(access_token=token, refresh_token=refresh_token)
        data_dict = userdata.model_dump(exclude_none=True)
        phone_value = data_dict.pop('phone', None)
        user_metadata = data_dict
        payload = {}
        if phone_value is not None:
            payload['phone'] = phone_value
        if user_metadata:
            payload['data'] = user_metadata
        print(payload)
        _ = supabase.auth.update_user(payload)
        return {"message": "User data updated successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Supabase error during deletion")