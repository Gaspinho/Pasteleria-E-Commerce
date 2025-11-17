# Pastelería E-Commerce - Backend API

Backend moderno construido con **FastAPI** y **Supabase** para la aplicación de e-commerce de pastelería.

## 🚀 Stack Tecnológico

- **Framework**: FastAPI
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **ORM**: Supabase Client (directo a PostgreSQL)
- **Validación**: Pydantic v2
- **CORS**: FastAPI Middleware

## 📁 Estructura del Proyecto

```
backend/
├── routers/
│   ├── users.py          # Endpoints de autenticación
│   ├── products.py       # Endpoints de productos
│   └── reviews.py        # Endpoints de reviews y feedback
├── server.py             # Aplicación FastAPI principal
├── .env                  # Variables de entorno (Supabase credentials)
├── requirements.txt      # Dependencias de Python
├── supabase_schema.sql   # Script para crear tablas
├── seed_data.sql         # Datos de prueba
└── SUPABASE_SETUP.md     # Guía completa de configuración
```

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
cd backend
```

### 2. Crear entorno virtual (recomendado)

```bash
python3 -m venv venv
source venv/bin/activate  # En macOS/Linux
# venv\Scripts\activate   # En Windows
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crea o edita el archivo `.env`:

```bash
SUPABASE_URL=https://[tu-proyecto].supabase.co
SUPABASE_KEY=[tu-anon-key]
SUPABASE_JWT_SECRET=[tu-jwt-secret]
```

### 5. Configurar base de datos en Supabase

Lee la guía completa en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta `supabase_schema.sql` en SQL Editor
3. (Opcional) Ejecuta `seed_data.sql` para datos de prueba

## ▶️ Ejecutar el Servidor

```bash
python3 server.py
```

El servidor estará disponible en: `http://localhost:8000`

### Verificar que funciona

```bash
curl http://localhost:8000/health
```

Deberías ver: `{"status":"healthy","service":"pasteleria-api"}`

## 📚 API Endpoints

### Root & Health
- `GET /` - Información de la API
- `GET /health` - Health check

### Usuarios (`/api/users`)
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout

### Productos (`/api/products`)
- `GET /api/products/products` - Listar productos
- `GET /api/products/products/{id}` - Obtener producto
- `GET /api/products/products/sku/{sku}` - Buscar por SKU
- `POST /api/products/products` - Crear producto (Admin)
- `PUT /api/products/products/{id}` - Actualizar producto (Admin)
- `DELETE /api/products/products/{id}` - Eliminar producto (Admin)
- `GET /api/products/categories` - Listar categorías
- `POST /api/products/categories` - Crear categoría (Admin)

### Reviews (`/api/feedback`)
- `GET /api/feedback/reviews` - Todas las reviews
- `GET /api/feedback/products/{id}/reviews` - Reviews de un producto
- `POST /api/feedback/reviews` - Crear review
- `DELETE /api/feedback/reviews/{id}` - Eliminar review (Admin)
- `GET /api/feedback/products/{id}/rating-summary` - Resumen de ratings
- `GET /api/feedback/questions` - Preguntas/mensajes
- `POST /api/feedback/questions` - Crear pregunta
- `DELETE /api/feedback/questions/{id}` - Eliminar pregunta (Admin)

## 📖 Documentación Interactiva

FastAPI genera documentación automática:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Puedes probar todos los endpoints directamente desde el navegador.

## 🗄️ Modelos de Datos

### Producto
```json
{
  "product_name": "Torta de Chocolate",
  "product_sku": "SKU-001",
  "product_description": "Deliciosa torta...",
  "product_price": 2500.00,
  "product_stock": 10,
  "product_is_sale": "Yes",
  "category_name": "Chocolate",
  "image_gallery": {
    "image1": "url1",
    "image2": "url2",
    "image3": "url3",
    "image4": "url4"
  }
}
```

### Review
```json
{
  "product_id": 1,
  "rating": 5,
  "content": "Excelente producto!",
  "author_name": "Juan Pérez",
  "author_email": "juan@example.com"
}
```

## 🧪 Testing

### Con curl

```bash
# Listar productos
curl http://localhost:8000/api/products/products

# Crear review
curl -X POST http://localhost:8000/api/feedback/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "rating": 5,
    "content": "Excelente!",
    "author_name": "Test",
    "author_email": "test@example.com"
  }'
```

### Con Thunder Client / Postman

Importa los endpoints desde la documentación Swagger.

## 🔒 Autenticación

### Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user_id": "uuid"
}
```

### Usar el token

```bash
curl http://localhost:8000/api/products/products \
  -H "Authorization: Bearer eyJ..."
```

## 🛠️ Desarrollo

### Hot Reload

El servidor se reinicia automáticamente cuando guardas cambios.

### Agregar un nuevo endpoint

1. Crea/edita un router en `routers/`
2. Importa el router en `server.py`
3. Añade con `app.include_router()`

Ejemplo:
```python
# routers/nuevo.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def test():
    return {"message": "test"}

# server.py
from routers import nuevo

app.include_router(
    nuevo.router,
    prefix="/api/nuevo",
    tags=["nuevo"]
)
```

## 🐛 Troubleshooting

### Error: ModuleNotFoundError
```bash
pip install -r requirements.txt
```

### Error: Supabase connection failed
- Verifica las credenciales en `.env`
- Asegúrate de que el proyecto Supabase esté activo

### Error: CORS
- Añade tu frontend URL a `origins` en `server.py`

### Error: No module named 'django'
- ✅ Correcto! Ya no usamos Django
- Si ves código de Django, puede ser del proyecto antiguo

## 📦 Dependencias Principales

```
fastapi==0.104.1          # Framework web
uvicorn==0.24.0           # ASGI server
supabase==2.3.0           # Cliente de Supabase
pydantic==2.5.0           # Validación de datos
python-dotenv==1.0.0      # Variables de entorno
```

## 🚀 Deployment

### Railway / Render / Fly.io

1. Añade `Procfile`:
   ```
   web: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

2. Configura variables de entorno en la plataforma

3. Deploy desde GitHub

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Notas

- ❌ **NO SE USA DJANGO**: Este proyecto migró de Django a FastAPI + Supabase
- ✅ Todos los modelos están en Supabase (SQL)
- ✅ Autenticación manejada por Supabase Auth
- ✅ No hay ORM, consultas directas con Supabase Client

## 📄 Licencia

MIT

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Add nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

**¿Necesitas ayuda?** Lee [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para más detalles.
