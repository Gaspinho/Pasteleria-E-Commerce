from assets.schemas import Producto
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_access_token(token: str = Depends(oauth2_scheme)):
    return token

router = APIRouter()

@router.get("/get_products", response_model=list[Producto])
async def get_products():
    try:
        response = supabase.from_("productos").select("*").execute()
        print(response)
        if not response.data:
            raise HTTPException(status_code=404, detail="No products found")
        
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")