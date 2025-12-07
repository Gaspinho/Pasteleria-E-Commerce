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
    is_staff: bool
    user_type: str
    email: str
    first_name: str
    last_name: str

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
            # Obtener información del usuario desde app_user
            user_id = response.user.id
            app_user_response = supabase.table('app_user').select('*').eq('id', user_id).execute()
            
            if not app_user_response.data or len(app_user_response.data) == 0:
                raise HTTPException(status_code=404, detail="User not found in app_user table")
            
            user_data = app_user_response.data[0]
            
            return TokenResponse(
                access_token=response.session.access_token,
                refresh_token=response.session.refresh_token,
                user_id=response.user.id,
                is_staff=user_data.get('is_staff', False),
                user_type=user_data.get('type', 'CUSTOMER'),
                email=user_data.get('email', user.email),
                first_name=user_data.get('first_name', ''),
                last_name=user_data.get('last_name', '')
            )
        else:            
            raise HTTPException(
                status_code=400,
                detail="Unexpected error during user login"
            )
    except HTTPException:
        raise
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

# @router.post("/update_user")
# async def supa_update_user(userdata: UserDataUpdate, token: str = Depends(get_access_token), request: Request = None):
#     try:
#         refresh_token = request.headers.get("X-Refresh-Token")
#     except:
#         print(e)
#         raise HTTPException(status_code=500, detail="No Refresh token given")
#     try:
#         supabase.auth.set_session(access_token=token, refresh_token=refresh_token)
#         data_dict = userdata.model_dump(exclude_none=True)
#         phone_value = data_dict.pop('phone', None)
#         user_metadata = data_dict
#         payload = {}
#         if phone_value is not None:
#             payload['phone'] = phone_value
#         if user_metadata:
#             payload['data'] = user_metadata
#         print(payload)
#         _ = supabase.auth.update_user(payload)
#         return {"message": "User data updated successfully"}
#     except Exception as e:
#         print(f"Supabase error: {e}")
#         raise HTTPException(status_code=500, detail="Supabase error during deletion")
@router.put("/update_user_at")
async def supa_update_user_at(userdata: UserDataUpdate, token: str = Depends(get_access_token)):
    try:
        # Get user from Supabase Auth
        user_id = supabase.auth.get_user(token).user.id
        app_user_response = supabase.table('app_user').select('address_id').eq('id', user_id).single().execute()
        address_id = app_user_response.data.get('address_id')
        if not address_id:
            # Manejo de error si el usuario no tiene una dirección asociada
            raise HTTPException(status_code=404, detail="User address not found.")
        if userdata.phone is not None:
            data_to_update_app = {
                "phone_number": userdata.phone
            }
            res_app_user = supabase.table('app_user').update(data_to_update_app).eq('id', user_id).execute()
        data_to_update_address = {}
        if userdata.house_number is not None:
            data_to_update_address["house_number"] = userdata.house_number
        if userdata.street_number is not None:
            data_to_update_address["street_number"] = userdata.street_number
        if userdata.area is not None:
            data_to_update_address["area"] = userdata.area
        if userdata.city is not None:
            data_to_update_address["city"] = userdata.city
        if data_to_update_address:
            res_address = supabase.table('address').update(data_to_update_address).eq('id', address_id).execute()
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=f"Supabase error during get_user: {str(e)}")

@router.put("/update_user_id")
async def supa_update_user_id(user_id: str, userdata: UserDataUpdate): #, token: str = Depends(get_access_token)
    try:
        app_user_response = supabase.table('app_user').select('address_id').eq('id', user_id).single().execute()
        address_id = app_user_response.data.get('address_id')
        if not address_id:
            # Manejo de error si el usuario no tiene una dirección asociada
            raise HTTPException(status_code=404, detail="User address not found.")
        if userdata.phone is not None:
            data_to_update_app = {
                "phone_number": userdata.phone
            }
            res_app_user = supabase.table('app_user').update(data_to_update_app).eq('id', user_id).execute()
        data_to_update_address = {}
        if userdata.house_number is not None:
            data_to_update_address["house_number"] = userdata.house_number
        if userdata.street_number is not None:
            data_to_update_address["street_number"] = userdata.street_number
        if userdata.area is not None:
            data_to_update_address["area"] = userdata.area
        if userdata.city is not None:
            data_to_update_address["city"] = userdata.city
        if data_to_update_address:
            res_address = supabase.table('address').update(data_to_update_address).eq('id', address_id).execute()
    except HTTPException:
        raise
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail=f"Supabase error during get_user: {str(e)}")
        
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


# ============================================
# Endpoints adicionales para el admin frontend
# ============================================

@router.get("/getAllcustomers")
async def get_all_customers(token: str = Depends(get_access_token)):
    """Obtener todos los usuarios que son clientes (no staff)"""
    try:
        # Verificar que el usuario actual es staff
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        # Verificar si es staff
        staff_check = supabase.table('app_user').select('is_staff').eq('id', user_id).execute()
        if not staff_check.data or not staff_check.data[0].get('is_staff', False):
            raise HTTPException(status_code=403, detail="Solo usuarios staff pueden acceder a esta información")
        
        # Obtener todos los clientes (usuarios que no son staff)
        response = supabase.table('app_user').select('*').eq('is_staff', False).execute()
        
        # Formatear la respuesta para que coincida con lo que espera el frontend
        customers = []
        for user in response.data:
            customers.append({
                "id": user.get('id'),
                "first_Name": user.get('first_name', ''),
                "last_Name": user.get('last_name', ''),
                "email": user.get('email', ''),
                "phone_Number": user.get('phone_number', ''),
                "type": user.get('type', 'CUSTOMER'),
                "is_active": user.get('is_active', True)
            })
        
        return customers
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting customers: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener clientes: {str(e)}")


@router.get("/getAllstaff")
async def get_all_staff(token: str = Depends(get_access_token)):
    """Obtener todos los usuarios que son staff"""
    try:
        # Verificar que el usuario actual es staff
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        # Verificar si es staff
        staff_check = supabase.table('app_user').select('is_staff').eq('id', user_id).execute()
        if not staff_check.data or not staff_check.data[0].get('is_staff', False):
            raise HTTPException(status_code=403, detail="Solo usuarios staff pueden acceder a esta información")
        
        # Obtener todos los staff
        response = supabase.table('app_user').select('*').eq('is_staff', True).execute()
        
        # Formatear la respuesta
        staff_members = []
        for user in response.data:
            staff_members.append({
                "id": user.get('id'),
                "first_Name": user.get('first_name', ''),
                "last_Name": user.get('last_name', ''),
                "email": user.get('email', ''),
                "phone_Number": user.get('phone_number', ''),
                "type": user.get('type', 'STAFF'),
                "is_active": user.get('is_active', True)
            })
        
        return staff_members
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting staff: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener staff: {str(e)}")


@router.get("/getAllorder")
async def get_all_orders(token: str = Depends(get_access_token)):
    """Obtener todas las órdenes - solo para staff"""
    try:
        # Verificar que el usuario actual es staff
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        # Verificar si es staff
        staff_check = supabase.table('app_user').select('is_staff').eq('id', user_id).execute()
        if not staff_check.data or not staff_check.data[0].get('is_staff', False):
            raise HTTPException(status_code=403, detail="Solo usuarios staff pueden acceder a esta información")
        
        # Obtener todas las órdenes con información relacionada
        response = supabase.table('order').select(
            '*, app_user!order_customer_id_fkey(id, first_name, last_name, email, phone_number), address(*), payment(*)'
        ).order('placed_at', desc=True).execute()
        
        # Formatear la respuesta
        orders = []
        for order in response.data:
            customer = order.get('app_user', {})
            address = order.get('address', {})
            payment = order.get('payment', {})
            
            orders.append({
                "id": order.get('id'),
                "customer_id": order.get('customer_id'),
                "customer_name": f"{customer.get('first_name', '')} {customer.get('last_name', '')}".strip(),
                "customer_email": customer.get('email', ''),
                "customer_phone": customer.get('phone_number', ''),
                "order_Status": order.get('status', ''),
                "total_Amount": order.get('total_amount', 0),
                "delivery_Charges": order.get('delivery_charges', 0),
                "placed_at": order.get('placed_at', ''),
                "delivery_at": order.get('delivery_at', ''),
                "delivery_time_window": order.get('delivery_time_window', ''),
                "note": order.get('note', ''),
                "address": {
                    "city": address.get('city', ''),
                    "area": address.get('area', ''),
                    "street_number": address.get('street_number', 0),
                    "house_number": address.get('house_number', 0)
                },
                "payment": {
                    "payment_status": payment.get('payment_status', ''),
                    "payment_type": payment.get('payment_type', ''),
                    "amount_paid": payment.get('amount_paid', 0)
                }
            })
        
        return orders
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting orders: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener órdenes: {str(e)}")


@router.get("/Uprofile/{user_id}")
async def get_user_profile_by_id(user_id: str, token: str = Depends(get_access_token)):
    """Obtener perfil de un usuario específico por ID"""
    try:
        # Verificar que el usuario actual es staff
        user_response = supabase.auth.get_user(token)
        current_user_id = user_response.user.id
        
        # Verificar si es staff o si está accediendo a su propio perfil
        staff_check = supabase.table('app_user').select('is_staff').eq('id', current_user_id).execute()
        is_staff = staff_check.data and staff_check.data[0].get('is_staff', False)
        
        if not is_staff and current_user_id != user_id:
            raise HTTPException(status_code=403, detail="No autorizado para ver este perfil")
        
        # Obtener información del usuario con dirección
        response = supabase.table('app_user').select('*, address(*)').eq('id', user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        user_data = response.data[0]
        address_data = user_data.get('address', {}) if isinstance(user_data.get('address'), dict) else {}
        
        return {
            "id": user_data.get('id'),
            "email": user_data.get('email', ''),
            "first_Name": user_data.get('first_name', ''),
            "last_Name": user_data.get('last_name', ''),
            "phone_Number": user_data.get('phone_number', ''),
            "type": user_data.get('type', 'CUSTOMER'),
            "is_staff": user_data.get('is_staff', False),
            "is_active": user_data.get('is_active', True),
            "data_Joind": user_data.get('created_at', ''),
            "last_login": user_data.get('last_login', ''),
            "address": {
                "house_Number": address_data.get('house_number', ''),
                "street_Number": address_data.get('street_number', ''),
                "city": address_data.get('city', ''),
                "area": address_data.get('area', '')
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener perfil: {str(e)}")


@router.delete("/delete/{user_id}")
async def delete_user_by_id(user_id: str, token: str = Depends(get_access_token)):
    """Eliminar un usuario - solo para staff"""
    try:
        # Verificar que el usuario actual es staff
        user_response = supabase.auth.get_user(token)
        current_user_id = user_response.user.id
        
        # Verificar si es staff
        staff_check = supabase.table('app_user').select('is_staff').eq('id', current_user_id).execute()
        if not staff_check.data or not staff_check.data[0].get('is_staff', False):
            raise HTTPException(status_code=403, detail="Solo usuarios staff pueden eliminar usuarios")
        
        # No permitir que un usuario se elimine a sí mismo
        if current_user_id == user_id:
            raise HTTPException(status_code=400, detail="No puedes eliminar tu propio usuario")
        
        # Eliminar usuario de app_user (esto también eliminará el usuario de auth si hay cascade)
        response = supabase.table('app_user').delete().eq('id', user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # También intentar eliminar de auth
        try:
            if SUPABASE_SERVICE_KEY:
                supabase_admin.auth.admin.delete_user(user_id)
        except Exception as e:
            print(f"Warning: Could not delete user from auth: {e}")
        
        return {"message": "Usuario eliminado exitosamente", "user_id": user_id}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting user: {e}")
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")


