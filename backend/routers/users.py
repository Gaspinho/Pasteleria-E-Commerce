from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from supabase import create_client, Client
import os

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

class User(BaseModel):
    email: str = Field(min_length=1, description="email cannot be empty.")
    password: str = Field(min_length=1, description="password cannot be empty.")
    admin: str | None = None

router = APIRouter()

@router.post("/register")
async def supa_register(user: User):
    user_dict = user.model_dump()
    metadata = {}
    if user_dict.get("admin"):
        metadata["admin"] = user_dict["admin"]
    try:
        response = supabase.auth.sign_up(email = user_dict["email"], password = user_dict["password"], data = metadata)
        if response.error:
            raise HTTPException(
                status_code=400,
                detail={"message": response.error.message, "code": response.error.status}
            )
        if response.user:
            return {"message": "User registered successfully!", "user_id": response.user.id}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration.")

@router.post("/login")
def supa_login(item_id: int):
    return 

@router.post("/logout")
def supa_logout(item_id: int):
    return 