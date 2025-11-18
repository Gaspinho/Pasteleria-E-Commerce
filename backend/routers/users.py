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
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")  # Para operaciones de admin

# Cliente normal para operaciones estándar
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Cliente admin para operaciones administrativas
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY) if SUPABASE_SERVICE_KEY else supabase

class User(BaseModel):
    email: str = Field(min_length=1, description="email cannot be empty.")
    password: str = Field(min_length=1, description="password cannot be empty.")
    first_name: str | None = None
    last_name: str | None = None
    admin: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str

class UserDataGet(BaseModel):
    email: str
    phone_number: str | None
    created_at: datetime
    last_login_at: datetime | None
    first_name: str
    last_name: str
    type: str
    id: str

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
        # Intentar con admin API si está disponible
        if SUPABASE_SERVICE_KEY:
            response = supabase_admin.auth.admin.create_user({
                "email": user.email, 
                "password": user.password, 
                "email_confirm": True,
                "user_metadata": metadata
            })
            user_id = response.user.id
            print(f"Usuario creado con admin API: {user_id}")
        else:
            # Fallback: usar signup normal
            response = supabase.auth.sign_up({
                "email": user.email,
                "password": user.password,
                "options": {
                    "data": metadata
                }
            })
            user_id = response.user.id
            print(f"Usuario creado con signup normal: {user_id}")
        
        if user_id:
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
                "id": user_id,
                "email": user.email,
                "first_name": user.first_name if user.first_name else 'Usuario',
                "last_name": user.last_name if user.last_name else '',
                "type": user_type,
                "is_staff": user.admin is not None,
                "is_active": True,
                "address_id": address_id
            }
            app_user_response = supabase.table('app_user').insert(new_user_data).execute()
            print(f"User {user_id} created in app_user: {app_user_response.data}")
            
            return {"message": "User registered successfully", "user_id": user_id}
        else:            
            raise HTTPException(
                status_code=400,
                detail="Unexpected error during user registration"
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error completo: {str(e)}")
        print(f"Tipo de error: {type(e)}")
        error_message = str(e)
        
        # Mensajes de error más específicos
        if "User not allowed" in error_message:
            raise HTTPException(
                status_code=400, 
                detail="No se pudo crear el usuario. Agrega SUPABASE_SERVICE_KEY al archivo .env o habilita el registro público en Supabase."
            )
        elif "User already registered" in error_message or "already exists" in error_message:
            raise HTTPException(
                status_code=400, 
                detail="Este correo electrónico ya está registrado."
            )
        raise HTTPException(status_code=400, detail=f"Error durante el registro: {error_message}")

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
        raise HTTPException(status_code=500, detail="Supabase error during deletion")

@router.put("/updatePhoneNumber/{user_id}")
async def update_phone_number(user_id: str, phone_data: dict):
    """
    Actualizar el número de teléfono de un usuario
    """
    try:
        phone_number = phone_data.get('phone_number')
        if not phone_number:
            raise HTTPException(status_code=400, detail="phone_number is required")
        
        # Actualizar en la tabla app_user
        response = supabase.table('app_user').update({
            'phone_number': phone_number
        }).eq('id', user_id).execute()
        
        if response.data:
            return {
                "message": "Phone number updated successfully",
                "user_id": user_id
            }
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating phone number: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating phone number: {str(e)}")

@router.get("/get_user", response_model=UserDataGet)
async def supa_get_user(token: str = Depends(get_access_token)):
    try:
        # Get user from Supabase Auth
        auth_response = supabase.auth.get_user(token)
        user_id = auth_response.user.id
        
        # Get user data from app_user table
        app_user_response = supabase.table('app_user').select('*').eq('id', user_id).execute()
        
        if not app_user_response.data or len(app_user_response.data) == 0:
            raise HTTPException(status_code=404, detail="User not found in app_user table")
        
        user_data = app_user_response.data[0]
        
        return UserDataGet(
            id=user_data['id'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            phone_number=user_data.get('phone_number'),
            type=user_data['type'],
            created_at=auth_response.user.created_at,
            last_login_at=auth_response.user.last_sign_in_at
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=f"Supabase error during get_user: {str(e)}")

# Alias para compatibilidad con el frontend
@router.get("/profile/", response_model=UserDataGet)
async def get_profile(token: str = Depends(get_access_token)):
    """Alias de get_user para compatibilidad con el frontend"""
    return await supa_get_user(token)

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