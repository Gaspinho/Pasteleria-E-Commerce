from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Solo para Test
import sys  
current_dir = os.path.dirname(__file__)
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.append(parent_dir)
###################################################################
from assets.schemas import User, TokenResponse, UserDataGet, UserDataUpdate

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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
        response = supabase.auth.admin.create_user({"email" : user.email, "password" : user.password, "data" : metadata})
        _ = supabase.auth.admin.update_user_by_id( #bypass email confirmation
            response.user.id, 
            {"email_confirm": True}
        )
        if response.user:
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
        _ = supabase.auth.update_user(payload)
        return {"message": "User data updated successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Supabase error during deletion")