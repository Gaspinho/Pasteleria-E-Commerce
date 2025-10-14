from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from supabase import create_client, Client
import os

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
        response = supabase.auth.sign_up(email = user.email, password = user.password, data = metadata)
        if response.error:
            raise HTTPException(
                status_code=400,
                detail={"message": response.error.message, "code": response.error.status}
            )
        if response.user:
            return {"message": "User registered successfully", "user_id": response.user.id}
        else:            
            raise HTTPException(
                status_code=400,
                detail={"message": "Unexpected error during user registration"}
            )
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration.")

@router.post("/login", response_model=TokenResponse)
async def supa_login(user: User):
    try:
        response = supabase.auth.sign_in_with_password(email = user.email, password = user.password)
        if response.error:
            raise HTTPException(
                status_code=401,
                detail={"message": response.error.message, "code": response.error.status}
            )
        if response.user and response.session:
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                user_id=response.user.id
            )
        else:            
            raise HTTPException(
                status_code=400,
                detail={"message": "Unexpected error during user login"}
            )
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration.")

@router.post("/logout")
async def supa_logout(token: str = Depends(get_access_token)):
    try:
        response = supabase.auth.admin.sign_out(token)
        return {"message": "User logged out successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration.")