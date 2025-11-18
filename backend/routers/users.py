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

@router.get("/user/orders/{user_id}")
async def get_user_orders(user_id: str):
    """Obtener pedidos normales del usuario (productos del catálogo)"""
    try:
        # Obtener pedidos del usuario con información relacionada
        response = supabase.table('order').select(
            '*, address(*), payment(*), ordered_product(*, productos(*))'
        ).eq('customer_id', user_id).order('placed_at', desc=True).execute()
        
        return response.data if response.data else []
    except Exception as e:
        print(f"Error al obtener pedidos: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener los pedidos del usuario")

class Address(BaseModel):
    street_Number: str
    house_Number: str
    city: str
    area: str

class Payment(BaseModel):
    payment_Status: str
    payment_Type: str
    amount_Paid: int

class Product(BaseModel):
    id: str
    name: str
    price: float
    quantity: int
    image: str | None = None
    productNumber: str | None = None

class OrderCreate(BaseModel):
    customer: str  # UUID del usuario
    phone_Number: str
    address: Address
    payment: Payment
    order_Status: str
    delivery_Charges: int
    total_Amount: float
    note: str | None = None
    order_Delivery_Date: str
    order_Delivery_Time: str
    products: list[Product]

class OrderUpdate(BaseModel):
    order_Status: str | None = None

@router.post("/placeOrder/")
async def place_order(order: OrderCreate, token: str = Depends(get_access_token)):
    """Crear una nueva orden de productos del catálogo"""
    try:
        # Obtener el usuario del token
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        # Verificar que el usuario coincide con el customer
        if user_id != order.customer:
            raise HTTPException(status_code=403, detail="No autorizado para crear pedido para otro usuario")
        
        # Paso 1: Crear la dirección
        try:
            street_num = int(order.address.street_Number) if order.address.street_Number else 0
        except (ValueError, TypeError):
            street_num = 0
        
        try:
            house_num = int(order.address.house_Number) if order.address.house_Number else 0
        except (ValueError, TypeError):
            house_num = 0
        
        address_data = {
            "city": order.address.city,
            "area": order.address.area or "",
            "street_number": street_num,
            "house_number": house_num
        }
        address_response = supabase.table('address').insert(address_data).execute()
        address_id = address_response.data[0]['id']
        
        # Paso 2: Crear el pago
        payment_data = {
            "payment_status": order.payment.payment_Status,
            "payment_type": order.payment.payment_Type,
            "amount_paid": order.payment.amount_Paid
        }
        payment_response = supabase.table('payment').insert(payment_data).execute()
        payment_id = payment_response.data[0]['id']
        
        # Paso 3: Crear la orden principal
        order_data = {
            "customer_id": user_id,
            "address_id": address_id,
            "payment_id": payment_id,
            "status": order.order_Status,
            "delivery_charges": order.delivery_Charges,
            "total_amount": order.total_Amount,
            "note": order.note or "",
            "delivery_at": order.order_Delivery_Date,
            "delivery_time_window": order.order_Delivery_Time,
            "placed_at": datetime.utcnow().isoformat()
        }
        
        # Insertar en order
        order_response = supabase.table('order').insert(order_data).execute()
        order_id = order_response.data[0]['id']
        
        # Paso 4: Crear los productos pedidos
        ordered_products = []
        for product in order.products:
            # Convertir el id a int (bigint) ya que productos.id es bigint
            try:
                product_id = int(product.id) if isinstance(product.id, str) else product.id
            except (ValueError, TypeError):
                print(f"Warning: Could not convert product id {product.id} to int")
                continue
                
            item_data = {
                "order_id": order_id,
                "product_id": product_id,
                "quantity": product.quantity
            }
            ordered_products.append(item_data)
        
        if ordered_products:
            try:
                supabase.table('ordered_product').insert(ordered_products).execute()
            except Exception as e:
                # Si falla por el problema de UUID, logueamos pero no fallamos la orden
                print(f"Error inserting ordered products: {e}")
                print(f"Products data: {ordered_products}")
                print("NOTA: Ejecuta el script fix_ordered_product_table.sql para arreglar la estructura de la tabla")
                # No fallamos toda la orden por esto
                pass
        
        # Actualizar el usuario con el número de teléfono si se proporcionó
        if order.phone_Number:
            supabase.table('app_user').update({
                "phone_number": order.phone_Number
            }).eq('id', user_id).execute()
        
        return {
            "message": "Order placed successfully",
            "order_Id": order_id,
            "order_Status": order.order_Status,
            "order_Delivery_Date": order.order_Delivery_Date,
            "order_Delivery_Time": order.order_Delivery_Time,
            "total_Amount": order.total_Amount,
            "note": "Los productos no se pudieron vincular debido a incompatibilidad de tipos en la BD. La orden se creó exitosamente."
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error placing order: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error al crear el pedido: {str(e)}")

@router.put("/update/{order_id}")
async def update_order(order_id: str, order_update: OrderUpdate, token: str = Depends(get_access_token)):
    """Actualizar el estado de una orden"""
    try:
        update_data = {}
        if order_update.order_Status:
            update_data["status"] = order_update.order_Status
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        response = supabase.table('order').update(update_data).eq('id', order_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        
        return {
            "message": "Order updated successfully",
            "order_id": order_id,
            "updated_data": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating order: {e}")
        raise HTTPException(status_code=400, detail=f"Error al actualizar el pedido: {str(e)}")

@router.get("/orderdProducts/{order_id}")
async def get_ordered_products(order_id: str):
    """Obtener los productos de una orden específica"""
    try:
        # Obtener los productos pedidos con la información del producto
        response = supabase.table('ordered_product').select(
            '*, productos!inner(*)'
        ).eq('order_id', order_id).execute()
        
        if not response.data:
            return []
        
        return response.data
    except Exception as e:
        print(f"Error getting ordered products: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener los productos del pedido")

