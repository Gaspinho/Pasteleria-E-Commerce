from pydantic import BaseModel, Field


class User(BaseModel):
    email: str = Field(min_length=1, description="email cannot be empty.")
    password: str = Field(min_length=1, description="password cannot be empty.")
    admin: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str

class Producto(BaseModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    imagen_url: str