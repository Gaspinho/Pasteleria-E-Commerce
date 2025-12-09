from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

tables = ['sponge_flavor', 'cake_shape_layer', 'icing', 'msg_color', 'decoration_image']

for table in tables:
    print(f'\n{"="*50}')
    print(f'Tabla: {table}')
    print(f'{"="*50}')
    response = supabase.table(table).select('*').order('id').execute()
    
    for idx, record in enumerate(response.data, 1):
        # Obtener el nombre del campo apropiado según la tabla
        if table == 'sponge_flavor':
            name = record.get('name', 'N/A')
        elif table == 'cake_shape_layer':
            name = f"{record.get('shape_name', 'N/A')} - {record.get('layer_description', 'N/A')}"
        elif table == 'icing':
            name = record.get('name', 'N/A')
        elif table == 'msg_color':
            name = f"{record.get('color_name', 'N/A')} ({record.get('color_code', 'N/A')})"
        elif table == 'decoration_image':
            name = record.get('image', 'N/A')
        
        print(f"{idx}. {name}")
        print(f"   UUID: {record.get('id')}")
