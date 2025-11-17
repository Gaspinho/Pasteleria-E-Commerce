from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import os

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================
# PYDANTIC MODELS
# ============================================

class ReviewCreate(BaseModel):
    product_id: int = Field(description="ID del producto a calificar")
    rating: int = Field(ge=1, le=5, description="Calificación de 1 a 5 estrellas")
    content: Optional[str] = Field(None, max_length=520, description="Contenido de la reseña")
    author_name: str = Field(min_length=1, max_length=100, description="Nombre del autor")
    author_email: EmailStr = Field(description="Email del autor")

class ReviewResponse(BaseModel):
    review_id: int
    product_id: int
    product_name: Optional[str]
    user_id: Optional[str]
    author_name: Optional[str]
    author_email: Optional[str]
    rating: int
    content: Optional[str]
    review_date: datetime
    created_at: datetime

class QuestionCreate(BaseModel):
    user_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1, description="Mensaje o pregunta")

class QuestionResponse(BaseModel):
    question_id: int
    user_name: str
    email: str
    message: str
    message_date: datetime
    created_at: datetime

# ============================================
# ROUTER
# ============================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_access_token(token: str = Depends(oauth2_scheme)):
    return token

router = APIRouter()

# ============================================
# REVIEW ENDPOINTS
# ============================================

@router.get("/reviews", response_model=List[ReviewResponse])
async def get_all_reviews(limit: Optional[int] = 100):
    """Obtener todas las reseñas"""
    try:
        response = supabase.table("reviews_with_product").select("*").limit(limit).order("review_date", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching reviews")

@router.get("/products/{product_id}/reviews", response_model=List[ReviewResponse])
async def get_product_reviews(product_id: int):
    """Obtener todas las reseñas de un producto específico"""
    try:
        response = supabase.table("reviews_with_product").select("*").eq("product_id", product_id).order("review_date", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching product reviews")

@router.post("/reviews", response_model=ReviewResponse)
async def create_review(review: ReviewCreate):
    """
    Crear una nueva reseña para un producto.
    No requiere autenticación, pero se puede asociar a un usuario si está registrado.
    """
    try:
        # Verificar que el producto existe
        product = supabase.table("productos").select("id").eq("id", review.product_id).execute()
        if not product.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Intentar encontrar el usuario por email (si existe)
        customer_id = None
        try:
            # Buscar en app_user por email
            user_response = supabase.table("app_user").select("id").eq("email", review.author_email).execute()
            if user_response.data:
                customer_id = user_response.data[0]["id"]
        except:
            pass  # Si no se puede obtener el usuario, continuar sin customer_id
        
        # Crear la reseña (usando nombres correctos de columnas)
        review_data = {
            "product_id_fk": review.product_id,
            "rating": review.rating,
            "content": review.content,
            "author_name": review.author_name,
            "author_email": review.author_email,
            "customer_id": customer_id
        }
        
        response = supabase.table("review").insert(review_data).execute()
        
        if response.data:
            # Obtener la reseña completa con información del producto
            full_review = supabase.table("reviews_with_product").select("*").eq("review_id", response.data[0]["id"]).execute()
            return full_review.data[0] if full_review.data else response.data[0]
        
        raise HTTPException(status_code=400, detail="Error creating review")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/reviews/{review_id}")
async def delete_review(review_id: int, token: str = Depends(get_access_token)):
    """Eliminar una reseña (Admin only o usuario propietario)"""
    try:
        response = supabase.table("review").delete().eq("id", review_id).execute()
        return {"message": "Review deleted successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error deleting review")

@router.get("/reviews/{review_id}", response_model=ReviewResponse)
async def get_review(review_id: int):
    """Obtener una reseña específica por ID"""
    try:
        response = supabase.table("reviews_with_product").select("*").eq("review_id", review_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching review")

# ============================================
# QUESTION ENDPOINTS
# ============================================

@router.get("/questions", response_model=List[QuestionResponse])
async def get_all_questions(limit: Optional[int] = 100):
    """Obtener todas las preguntas/mensajes"""
    try:
        response = supabase.table("question").select("*").limit(limit).order("message_date", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching questions")

@router.post("/questions", response_model=QuestionResponse)
async def create_question(question: QuestionCreate):
    """Crear una nueva pregunta o mensaje de contacto"""
    try:
        question_data = {
            "username": question.user_name,
            "email": question.email,
            "message": question.message
        }
        
        response = supabase.table("question").insert(question_data).execute()
        
        if response.data:
            return response.data[0]
        
        raise HTTPException(status_code=400, detail="Error creating question")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/questions/{question_id}")
async def delete_question(question_id: int, token: str = Depends(get_access_token)):
    """Eliminar una pregunta (Admin only)"""
    try:
        response = supabase.table("question").delete().eq("id", question_id).execute()
        return {"message": "Question deleted successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error deleting question")

@router.get("/products/{product_id}/rating-summary")
async def get_product_rating_summary(product_id: int):
    """Obtener resumen de calificaciones de un producto"""
    try:
        # Obtener todas las reviews del producto
        response = supabase.table("review").select("rating").eq("product_id_fk", product_id).execute()
        
        if not response.data:
            return {
                "product_id": product_id,
                "total_reviews": 0,
                "average_rating": 0,
                "rating_distribution": {
                    "5": 0, "4": 0, "3": 0, "2": 0, "1": 0
                }
            }
        
        ratings = [r["rating"] for r in response.data]
        total_reviews = len(ratings)
        average_rating = sum(ratings) / total_reviews if total_reviews > 0 else 0
        
        # Distribución de calificaciones
        rating_distribution = {
            "5": ratings.count(5),
            "4": ratings.count(4),
            "3": ratings.count(3),
            "2": ratings.count(2),
            "1": ratings.count(1)
        }
        
        return {
            "product_id": product_id,
            "total_reviews": total_reviews,
            "average_rating": round(average_rating, 2),
            "rating_distribution": rating_distribution
        }
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching rating summary")
