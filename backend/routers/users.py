from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
import os
from assets.schemas import User, TokenResponse
from dotenv import load_dotenv

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
        raise HTTPException(status_code=400, detail="Supabase error during registration")

@router.post("/logout")
async def supa_logout(token: str = Depends(get_access_token)):
    try:
        response = supabase.auth.admin.sign_out(token)
        return {"message": "User logged out successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration.")