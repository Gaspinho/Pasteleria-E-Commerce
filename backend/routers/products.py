from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import Optional, List
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import os
import uuid

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================
# PYDANTIC MODELS
# ============================================

class ImageGallery(BaseModel):
    image1: Optional[str] = None
    image2: Optional[str] = None
    image3: Optional[str] = None
    image4: Optional[str] = None

class ProductCreate(BaseModel):
    product_name: str = Field(min_length=1, max_length=100)
    product_sku: Optional[str] = Field(None, max_length=50)
    product_description: Optional[str] = " "
    product_price: float = Field(gt=0)
    product_stock: int = Field(ge=0)
    product_is_sale: bool = True
    category_name: str
    image_gallery: Optional[ImageGallery] = None

class ProductUpdate(BaseModel):
    product_name: Optional[str] = Field(None, min_length=1, max_length=100)
    product_sku: Optional[str] = Field(None, max_length=50)
    product_description: Optional[str] = None
    product_price: Optional[float] = Field(None, gt=0)
    product_stock: Optional[int] = Field(None, ge=0)
    product_is_sale: Optional[str] = None
    category_name: Optional[str] = None
    image_gallery: Optional[ImageGallery] = None

class ProductResponse(BaseModel):
    product_id: int
    product_name: str
    product_sku: Optional[str]
    product_description: Optional[str]
    product_price: float
    product_stock: int
    product_is_sale: str
    category_name: Optional[str]
    category_id: Optional[str]  # UUID en lugar de int
    image1: Optional[str]
    image2: Optional[str]
    image3: Optional[str]
    image4: Optional[str]
    image_path: Optional[str] = None
    review_count: Optional[int] = 0
    avg_rating: Optional[float] = 0.0
    created_at: datetime
    updated_at: datetime

class CategoryCreate(BaseModel):
    category_name: str = Field(min_length=1, max_length=50)

# ============================================
# ROUTER
# ============================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_access_token(token: str = Depends(oauth2_scheme)):
    return token

router = APIRouter()

# ============================================
# CATEGORY ENDPOINTS
# ============================================
        
@router.get("/categories", response_model=List[dict])
async def get_categories():
    """Obtener todas las categorías"""
    try:
        response = supabase.table("category").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching categories")

@router.post("/categories", response_model=dict)
async def create_category(category: CategoryCreate, token: str = Depends(get_access_token)):
    """Crear una nueva categoría (Admin only)"""
    try:
        response = supabase.table("category").insert({
            "name": category.category_name
        }).execute()
        
        if response.data:
            return response.data[0]
        raise HTTPException(status_code=400, detail="Error creating category")
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# PRODUCT ENDPOINTS
# ============================================

@router.get("/products", response_model=List[ProductResponse])
async def get_products(
    category: Optional[str] = None,
    is_sale: Optional[str] = None,
    limit: Optional[int] = 100
):
    """Obtener todos los productos con filtros opcionales"""
    try:
        query = supabase.table("productos_full").select("*")
        
        if category:
            query = query.eq("category_name", category)
        if is_sale:
            query = query.eq("product_is_sale", is_sale)
        
        response = query.limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    """Obtener un producto específico por ID"""
    try:
        response = supabase.table("productos_full").select("*").eq("product_id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching product")

@router.post("/create", response_model=dict)
async def create_product(product: ProductCreate, token: str = Depends(get_access_token)): 
    """Crear un nuevo producto guardando la imagen principal como Legacy (image_path)"""

    image_gallery_id = None
    product_id = None
    
    try:
        # 1. Verificación de permisos (Staff)
        auth_response = supabase.auth.get_user(token)
        user_id = auth_response.user.id
        staff_response = supabase.table("app_user").select("is_staff").eq("id", user_id).execute()
        
        is_staff = False
        if staff_response.data and len(staff_response.data) > 0:
            is_staff = staff_response.data[0]["is_staff"]
        
        if not is_staff:
            raise HTTPException(status_code=403, detail="Access Denied: User is not staff")
            
        # 2. Obtener category_id
        cat_response = supabase.table("category").select("id").eq("name", product.category_name).execute()
        if not cat_response.data:
            raise HTTPException(status_code=404, detail=f"Category '{product.category_name}' not found")
        category_id = cat_response.data[0]["id"]
        
        # 3. Crear image_gallery (Seguimos haciendo esto para no perder las fotos 2, 3 y 4)
        if product.image_gallery:
            img_response = supabase.table("image_gallery").insert({
                "image1": product.image_gallery.image1,
                "image2": product.image_gallery.image2,
                "image3": product.image_gallery.image3,
                "image4": product.image_gallery.image4
            }).execute()
            
            if img_response.data:
                image_gallery_id = img_response.data[0]["id"]
        
        # --- AQUÍ ESTÁ EL TRUCO PARA QUE SE VEA EN LA VISTA ---
        # Extraemos la imagen 1 para guardarla en la columna 'vieja' (image_path)
        legacy_image_path = " " # Valor por defecto
        if product.image_gallery and product.image_gallery.image1:
            legacy_image_path = product.image_gallery.image1
        # ------------------------------------------------------

        # 4. Crear producto
        product_data = {
            "nombre": product.product_name,
            "sku": product.product_sku or f"SKU-{uuid.uuid4().hex[:8].upper()}",
            "descripcion": product.product_description,
            "precio": product.product_price,
            "stock": product.product_stock,
            "is_sale": "Yes" if product.product_is_sale else "No",
            "category_id": category_id,
            "image_gallery_id": image_gallery_id,
            "image_path": legacy_image_path  # <<--- GUARDAMOS LA URL AQUÍ TAMBIÉN
        }
        
        response = supabase.table("productos").insert(product_data).execute()

        if not response.data:
            raise HTTPException(status_code=400, detail="Error creating product")
            
        created_product = response.data[0]
        
        return {
            **created_product,
            "category_name": product.category_name,
            "message": "Product created successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        # Rollback básico en caso de error
        try:
            if image_gallery_id and not product_id:
                supabase.table("image_gallery").delete().eq("id", image_gallery_id).execute()
        except:
            pass
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/products/{product_id}", response_model=dict)
async def update_product(product_id: int, product: ProductUpdate, token: str = Depends(get_access_token)):
    """Actualizar producto, su galería y mantener compatibilidad legacy"""
    try:
        # 1. Verificar existencia
        existing = supabase.table("productos").select("*").eq("id", product_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        current_product = existing.data[0]
        image_gallery_id = current_product.get("image_gallery_id")
        
        update_data = {}
        
        # Mapeo de campos básicos
        if product.product_name: update_data["nombre"] = product.product_name
        if product.product_sku: update_data["sku"] = product.product_sku
        if product.product_description is not None: update_data["descripcion"] = product.product_description
        if product.product_price: update_data["precio"] = product.product_price
        if product.product_stock is not None: update_data["stock"] = product.product_stock
        if product.product_is_sale: update_data["is_sale"] = product.product_is_sale
        
        # Actualizar categoría
        if product.category_name:
            cat_response = supabase.table("category").select("id").eq("name", product.category_name).execute()
            if cat_response.data:
                update_data["category_id"] = cat_response.data[0]["id"]
        
        # --- LÓGICA DE IMÁGENES ---
        new_main_image = None
        
        # A. Si ya existe galería, la actualizamos
        if image_gallery_id and product.image_gallery:
            img_update = {}
            if product.image_gallery.image1 is not None: 
                img_update["image1"] = product.image_gallery.image1
                new_main_image = product.image_gallery.image1 # Capturamos la nueva imagen principal
            if product.image_gallery.image2 is not None: img_update["image2"] = product.image_gallery.image2
            if product.image_gallery.image3 is not None: img_update["image3"] = product.image_gallery.image3
            if product.image_gallery.image4 is not None: img_update["image4"] = product.image_gallery.image4
            
            if img_update:
                supabase.table("image_gallery").update(img_update).eq("id", image_gallery_id).execute()

        # B. Si NO existe galería pero enviaron fotos, creamos una nueva
        elif not image_gallery_id and product.image_gallery:
            img_insert = {
                "image1": product.image_gallery.image1,
                "image2": product.image_gallery.image2,
                "image3": product.image_gallery.image3,
                "image4": product.image_gallery.image4
            }
            new_gallery = supabase.table("image_gallery").insert(img_insert).execute()
            if new_gallery.data:
                update_data["image_gallery_id"] = new_gallery.data[0]["id"]
                new_main_image = product.image_gallery.image1
        
        # --- COMPATIBILIDAD LEGACY ---
        # Si se actualizó la imagen 1, actualizamos también image_path
        if new_main_image:
            update_data["image_path"] = new_main_image
        # -----------------------------

        if update_data:
            supabase.table("productos").update(update_data).eq("id", product_id).execute()
            
        full_product = supabase.table("productos_full").select("*").eq("product_id", product_id).execute()
        return full_product.data[0] if full_product.data else {}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/products/{product_id}")
async def delete_product(product_id: int, token: str = Depends(get_access_token)):
    """Eliminar un producto (Admin only)"""
    try:
        response = supabase.table("productos").delete().eq("id", product_id).execute()
        return {"message": "Product deleted successfully"}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error deleting product")

@router.get("/products/sku/{sku}", response_model=ProductResponse)
async def get_product_by_sku(sku: str):
    """Obtener un producto por su SKU"""
    try:
        response = supabase.table("productos_full").select("*").eq("product_sku", sku).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching product")


# ============================================
# Legacy endpoints para compatibilidad con frontend admin
# ============================================

@router.get("/getAllproduct")
async def get_all_products_legacy():
    """Endpoint legacy - obtener todos los productos para admin frontend"""
    try:
        response = supabase.table("productos_full").select("*").order("product_id", desc=True).execute()
        
        # Formatear respuesta para el frontend
        products = []
        for product in response.data:
            products.append({
                "product_Id": product.get("product_id"),
                "product_Name": product.get("product_name"),
                "product_SKU": product.get("product_sku"),
                "product_Description": product.get("product_description"),
                "product_Price": product.get("product_price"),
                "product_Stock": product.get("product_stock"),
                "product_Is_Sale": product.get("product_is_sale"),
                "product_category": {
                    "category_Id": product.get("category_id"),
                    "category_Name": product.get("category_name")
                },
                "imageGallery": {
                    "image1": product.get("image1", ""),
                    "image2": product.get("image2", ""),
                    "image3": product.get("image3", ""),
                    "image4": product.get("image4", "")
                },
                "review_Count": product.get("review_count", 0),
                "avg_Rating": product.get("avg_rating", 0.0),
                "created_at": product.get("created_at"),
                "updated_at": product.get("updated_at")
            })
        
        return products
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")


@router.get("/getDetailedProduct/{product_id}")
async def get_detailed_product_legacy(product_id: int):
    """Endpoint legacy - obtener detalles de un producto"""
    try:
        response = supabase.table("productos_full").select("*").eq("product_id", product_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product = response.data[0]
        return {
            "product_Id": product.get("product_id"),
            "product_Name": product.get("product_name"),
            "product_SKU": product.get("product_sku"),
            "product_Description": product.get("product_description"),
            "product_Price": product.get("product_price"),
            "product_Stock": product.get("product_stock"),
            "product_Is_Sale": product.get("product_is_sale"),
            "category_Name": product.get("category_name"),
            "category_Id": product.get("category_id"),
            "imageGallery": {
                "id": product.get("image_gallery_id"),
                "image1": product.get("image1", ""),
                "image2": product.get("image2", ""),
                "image3": product.get("image3", ""),
                "image4": product.get("image4", "")
            },
            "review_Count": product.get("review_count", 0),
            "avg_Rating": product.get("avg_rating", 0.0),
            "created_at": product.get("created_at"),
            "updated_at": product.get("updated_at")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching product")


@router.delete("/delete/{product_id}")
async def delete_product_legacy(product_id: int, token: str = Depends(get_access_token)):
    """Endpoint legacy - eliminar un producto"""
    return await delete_product(product_id, token)


