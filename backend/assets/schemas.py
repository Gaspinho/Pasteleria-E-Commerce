from pydantic import BaseModel, Field
from datetime import datetime


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

class Producto(BaseModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    imagen_url: str