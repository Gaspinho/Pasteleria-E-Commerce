from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
from typing import Optional
import os

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Modelos Pydantic basados en el schema de Supabase
class Address(BaseModel):
    street_Number: str
    house_Number: str
    city: str
    area: str

class Payment(BaseModel):
    payment_Status: str = "Pending"
    payment_Type: str = "Cash On Delivery"
    amount_Paid: float = 0

class CustomCakeCreate(BaseModel):
    layer_id: Optional[str] = None
    spongeflavor_id: Optional[str] = None
    fillingtopdecoration_id: Optional[str] = None  # icing_id
    imagetopdecoration_id: Optional[str] = None
    icing: Optional[str] = None
    amount: float
    msg_on_cake: Optional[str] = None
    msg_color_id: Optional[str] = None
    special_instruction: Optional[str] = None

class CustomOrderCreate(BaseModel):
    phone_Number: str
    CustomOrder: str  # UUID del custom_cake
    address: Address
    payment: Payment
    delivery_Charges: float
    order_Delivery_Date: str
    order_Delivery_Time: str

class CustomOrderUpdate(BaseModel):
    status: Optional[str] = None

router = APIRouter()

async def get_access_token(token: str = Depends(oauth2_scheme)):
    return token

# ENDPOINT PARA CREAR EL CUSTOM CAKE (diseño del pastel)
@router.post("/post/")
async def create_custom_cake(
    layer_id: Optional[str] = Form(None),
    spongeflavor_id: Optional[str] = Form(None),
    fillingtopdecoration_id: Optional[str] = Form(None),
    imagetopdecoration_id: Optional[str] = Form(None),
    icing: Optional[str] = Form(None),
    amount: str = Form(...),
    msg_on_cake: Optional[str] = Form(None),
    msg_color_id: Optional[str] = Form(None),
    special_instruction: Optional[str] = Form(None),
    token: str = Depends(get_access_token)  # Obtener del header de autorización
):
    """
    Crear el diseño del pastel personalizado (custom_cake)
    Este endpoint recibe form data y crea el custom_cake en Supabase
    """
    try:
        # LOG: Imprimir todos los datos recibidos
        print(f"\n=== DATOS RECIBIDOS ===")
        print(f"layer_id: {layer_id}")
        print(f"spongeflavor_id: {spongeflavor_id}")
        print(f"fillingtopdecoration_id: {fillingtopdecoration_id}")
        print(f"imagetopdecoration_id: {imagetopdecoration_id}")
        print(f"icing: {icing}")
        print(f"amount: {amount}")
        print(f"msg_on_cake: {msg_on_cake}")
        print(f"msg_color_id: {msg_color_id}")
        print(f"special_instruction: {special_instruction}")
        print(f"======================\n")
        
        # Obtener el usuario del token
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        user_email = user_response.user.email
        
        # Verificar si el usuario existe en app_user, si no, crearlo
        existing_user = supabase.table('app_user').select('id').eq('id', user_id).execute()
        
        if not existing_user.data or len(existing_user.data) == 0:
            print(f"User {user_id} not found in app_user, creating...")
            
            # Crear dirección por defecto
            default_address = {
                "city": "Not specified",
                "area": "Not specified",
                "street_number": 0,
                "house_number": 0
            }
            address_response = supabase.table('address').insert(default_address).execute()
            address_id = address_response.data[0]['id'] if address_response.data else None
            
            # Crear usuario en app_user
            user_metadata = user_response.user.user_metadata or {}
            new_user_data = {
                "id": user_id,
                "email": user_email,
                "first_name": user_metadata.get('first_name', 'Customer'),
                "last_name": user_metadata.get('last_name', ''),
                "type": "CUSTOMER",
                "is_staff": False,
                "is_active": True,
                "address_id": address_id
            }
            supabase.table('app_user').insert(new_user_data).execute()
            print(f"User {user_id} created in app_user")
        
        # Función auxiliar para validar UUID
        def is_valid_uuid(val):
            if not val or val == "undefined" or val == "null":
                return False
            try:
                import uuid
                uuid.UUID(str(val))
                return True
            except:
                return False
        
        # Función auxiliar para obtener UUID desde ID numérico
        def get_uuid_from_numeric_id(table_name, numeric_id, id_column='id'):
            if not numeric_id or numeric_id == "undefined" or numeric_id == "null" or str(numeric_id) == "0":
                return None
            try:
                # Primero intentar como UUID
                if is_valid_uuid(numeric_id):
                    return numeric_id
                
                # Convertir a entero
                numeric_id_int = int(numeric_id)
                if numeric_id_int <= 0:
                    return None
                
                # Obtener todos los registros ordenados por id
                response = supabase.table(table_name).select('*').order('id').execute()
                
                print(f"\n--- Tabla {table_name} tiene {len(response.data) if response.data else 0} registros ---")
                if response.data:
                    for idx, record in enumerate(response.data, 1):
                        print(f"  Posición {idx}: ID={record.get('id')[:8]}... {record}")
                
                if response.data and len(response.data) >= numeric_id_int:
                    # Obtener el elemento en la posición (numeric_id - 1) ya que es 1-indexed
                    uuid_result = response.data[numeric_id_int - 1]['id']
                    print(f"✓ Convirtiendo {table_name} numeric_id {numeric_id} → posición {numeric_id_int} → UUID: {uuid_result}")
                    return uuid_result
                else:
                    print(f"✗ {table_name} solo tiene {len(response.data) if response.data else 0} registros, pero se pidió posición {numeric_id_int}")
                    
            except Exception as e:
                print(f"Error getting UUID for {table_name} with id {numeric_id}: {e}")
                return None
            return None
        
        # Preparar datos para custom_cake - solo incluir UUIDs válidos
        custom_cake_data = {
            "customer_id": user_id,
            "amount": float(amount),
            "msg_on_cake": msg_on_cake or "",
            "special_instruction": special_instruction or "",
            "order_status": "Order Pending",
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Convertir IDs numéricos a UUIDs con los nombres correctos de las tablas según el schema
        layer_uuid = get_uuid_from_numeric_id('cake_shape_layer', layer_id) if layer_id else None
        if layer_uuid:
            custom_cake_data["shape_layer_id"] = layer_uuid
            print(f"✓ layer_id {layer_id} → UUID: {layer_uuid}")
            
        sponge_uuid = get_uuid_from_numeric_id('sponge_flavor', spongeflavor_id) if spongeflavor_id else None
        if sponge_uuid:
            custom_cake_data["sponge_flavor_id"] = sponge_uuid
            print(f"✓ spongeflavor_id {spongeflavor_id} → UUID: {sponge_uuid}")
            
        # fillingtopdecoration_id corresponde a la tabla 'icing'
        icing_uuid = get_uuid_from_numeric_id('icing', fillingtopdecoration_id) if fillingtopdecoration_id else None
        if icing_uuid:
            custom_cake_data["icing_id"] = icing_uuid
            print(f"✓ fillingtopdecoration_id {fillingtopdecoration_id} → UUID: {icing_uuid}")
            
        # imagetopdecoration_id corresponde a la tabla 'decoration_image'
        image_uuid = get_uuid_from_numeric_id('decoration_image', imagetopdecoration_id) if imagetopdecoration_id else None
        if image_uuid:
            custom_cake_data["top_img_decoration_id"] = image_uuid
            print(f"✓ imagetopdecoration_id {imagetopdecoration_id} → UUID: {image_uuid}")
            
        # msg_color_id puede ser 0, en ese caso no guardarlo
        if msg_color_id and str(msg_color_id) != "0":
            msg_color_uuid = get_uuid_from_numeric_id('msg_color', msg_color_id)
            if msg_color_uuid:
                custom_cake_data["msg_color_id"] = msg_color_uuid
                print(f"✓ msg_color_id {msg_color_id} → UUID: {msg_color_uuid}")
        
        print(f"\nCustom cake data to insert: {custom_cake_data}")
        
        # Insertar en custom_cake
        response = supabase.table('custom_cake').insert(custom_cake_data).execute()
        
        print(f"\n=== RESPUESTA DE SUPABASE ===")
        print(f"Response data: {response.data}")
        print(f"==============================\n")
        
        if response.data:
            return {
                "success": True,
                "id": response.data[0]['id'],
                "message": "Custom cake created successfully"
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to create custom cake")
            
    except Exception as e:
        print(f"Error creating custom cake: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error creating custom cake: {str(e)}")

@router.get("/getAllCustomizeOrder/")
async def get_all_custom_orders():
    """Obtener todas las órdenes personalizadas"""
    try:
        response = supabase.table('custom_cake_order').select('*, custom_cake(*), address(*), payment(*)').execute()
        # Devolver el array directamente, no dentro de un objeto "orders"
        return response.data if response.data else []
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching custom orders")

@router.get("/getUserCustomizeOrder/{custom_cake_id}")
async def get_user_custom_order_by_id(custom_cake_id: str):
    """
    Obtener detalles de un custom_cake específico por su ID
    Incluye todas las relaciones necesarias para mostrar en el frontend
    """
    try:
        print(f"\n=== OBTENIENDO CUSTOM CAKE: {custom_cake_id} ===")
        
        # Obtener el custom_cake con todas sus relaciones
        response = supabase.table('custom_cake').select(
            '''
            *,
            sponge_flavor:sponge_flavor_id(*),
            shape_layer:shape_layer_id(*),
            icing:icing_id(*),
            top_img_decoration:top_img_decoration_id(*),
            msg_color:msg_color_id(*),
            final_product_img:final_product_img_id(*)
            '''
        ).eq('id', custom_cake_id).single().execute()
        
        print(f"Datos raw de Supabase: {response.data}")
        
        if response.data:
            # Transformar los datos al formato que espera el frontend
            custom_cake = response.data
            
            # Función auxiliar para obtener el nombre de manera segura
            def get_name_or_none(obj, key='name'):
                if obj and isinstance(obj, dict):
                    return obj.get(key)
                return None
            
            formatted_data = {
                "id": custom_cake.get("id"),
                "amount": custom_cake.get("amount", 0),
                "msg_on_cake": custom_cake.get("msg_on_cake") or "",
                "special_instruction": custom_cake.get("special_instruction") or "",
                "order_status": custom_cake.get("order_status", "Order Pending"),
                # Relaciones formateadas - devolver None si no hay datos
                "sponge_Flavor": {
                    "flavor_name": get_name_or_none(custom_cake.get("sponge_flavor"))
                } if custom_cake.get("sponge_flavor") else None,
                "Cake_Shape_layers": {
                    "cake_shape": get_name_or_none(custom_cake.get("shape_layer"), 'shape_name'),
                    "layer_description": custom_cake.get("shape_layer", {}).get("layer_description") if custom_cake.get("shape_layer") else None
                } if custom_cake.get("shape_layer") else None,
                "Icing": {
                    "decoration_name": get_name_or_none(custom_cake.get("icing"))
                } if custom_cake.get("icing") else None,
                "Top_Img_Decoration": {
                    "name": get_name_or_none(custom_cake.get("top_img_decoration"), 'image')
                } if custom_cake.get("top_img_decoration") else None,
                "finalProduct": {
                    "finalProductImg": get_name_or_none(custom_cake.get("final_product_img"), 'image') or "/assets/img/cake-placeholder.jpg"
                }
            }
            
            print(f"Datos formateados para el frontend: {formatted_data}")
            print(f"================================================\n")
            
            return formatted_data
        else:
            raise HTTPException(status_code=404, detail="Custom cake not found")
            
    except Exception as e:
        print(f"Supabase error: {e}")
        import traceback
        traceback.print_exc()
        # Retornar datos mínimos para evitar crash del frontend
        return {
            "id": custom_cake_id,
            "amount": 0,
            "msg_on_cake": "",
            "special_instruction": "",
            "order_status": "Order Pending",
            "sponge_Flavor": None,
            "Cake_Shape_layers": None,
            "Icing": None,
            "Top_Img_Decoration": None,
            "finalProduct": {"finalProductImg": "/assets/img/cake-placeholder.jpg"}
        }

@router.get("/getDetaildCustomOrder/{order_id}")
async def get_custom_order_detail(order_id: str):
    """Obtener detalles de una orden personalizada específica"""
    try:
        response = supabase.table('custom_cake_order').select('*, custom_cake(*), address(*), payment(*)').eq('id', order_id).single().execute()
        return response.data
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=404, detail="Custom order not found")

@router.post("/placeCustomOrder/")
async def place_custom_order(order: CustomOrderCreate, token: str = Depends(get_access_token)):
    """Crear una nueva orden personalizada"""
    try:
        # Obtener el usuario del token
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id
        
        # Paso 1: Crear la dirección
        # Convertir a números enteros, si es posible
        try:
            street_num = int(order.address.street_Number)
        except (ValueError, TypeError):
            street_num = 0
        
        try:
            house_num = int(order.address.house_Number)
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
        
        # Paso 3: Crear la orden de pastel personalizado
        custom_order_data = {
            "address_id": address_id,
            "payment_id": payment_id,
            "custom_cake_id": order.CustomOrder,  # UUID del custom_cake
            "delivery_charges": order.delivery_Charges,
            "delivery_at": order.order_Delivery_Date,
            "delivery_time_window": order.order_Delivery_Time,
            "placed_at": datetime.utcnow().isoformat()
        }
        
        # Insertar en custom_cake_order
        response = supabase.table('custom_cake_order').insert(custom_order_data).execute()
        
        # Actualizar el usuario con el número de teléfono si se proporcionó
        if order.phone_Number:
            supabase.table('app_user').update({
                "phone_number": order.phone_Number
            }).eq('id', user_id).execute()
        
        return {
            "message": "Custom order placed successfully",
            "order": response.data[0] if response.data else None,
            "order_id": response.data[0]['id'] if response.data else None
        }
    except Exception as e:
        print(f"Supabase error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Error placing custom order: {str(e)}")

@router.put("/updateStatus/{order_id}")
async def update_order_status(order_id: str, order_update: CustomOrderUpdate):
    """Actualizar el estado de una orden personalizada"""
    try:
        update_data = order_update.model_dump(exclude_none=True)
        
        # Actualizar el estado del custom_cake asociado
        order = supabase.table('custom_cake_order').select('custom_cake_id').eq('id', order_id).single().execute()
        
        if order.data and 'custom_cake_id' in order.data:
            custom_cake_id = order.data['custom_cake_id']
            supabase.table('custom_cake').update({"order_status": update_data.get('status')}).eq('id', custom_cake_id).execute()
        
        return {
            "message": "Order status updated successfully",
            "order_id": order_id
        }
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=400, detail=f"Error updating order status: {str(e)}")

@router.get("/getProfileOrder/{user_id}")
async def get_profile_orders(user_id: str):
    """Obtener órdenes del perfil de usuario"""
    try:
        # Obtener custom_cakes del usuario
        custom_cakes = supabase.table('custom_cake').select('id').eq('customer_id', user_id).execute()
        cake_ids = [cake['id'] for cake in custom_cakes.data]
        
        # Obtener las órdenes de esos cakes
        if cake_ids:
            response = supabase.table('custom_cake_order').select('*, custom_cake(*), address(*), payment(*)').in_('custom_cake_id', cake_ids).order('created_at', desc=True).execute()
            return {"orders": response.data}
        return {"orders": []}
    except Exception as e:
        print(f"Supabase error: {e}")
        raise HTTPException(status_code=500, detail="Error fetching profile orders")
