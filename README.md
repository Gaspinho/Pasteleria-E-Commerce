# 🍰 Pastelería Mil Sabores - Plataforma E-Commerce de Pastelería

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688.svg)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.9.0-3ECF8E.svg)](https://supabase.com/)
[![React](https://img.shields.io/badge/React-18.1.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-12.1.6-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 📖 Acerca del Proyecto

**Pastelería Mil Sabores** es una plataforma integral de comercio electrónico full-stack diseñada específicamente para pastelerías. Esta moderna aplicación web permite a los clientes navegar, personalizar y ordenar pasteles en línea, mientras proporciona a los propietarios de tiendas un potente panel de administración para la gestión completa del negocio.

### ✨ Características Principales

#### 🛒 **Funciones para Clientes**
- **Diseño de Pasteles Personalizado**: Herramienta interactiva de personalización de pasteles
- **Catálogo de Productos**: Navegar por extensas colecciones de pasteles por categorías
- **Autenticación de Usuario**: Sistema seguro de registro e inicio de sesión
- **Carrito de Compras**: Agregar, modificar y gestionar pedidos
- **Seguimiento de Pedidos**: Actualizaciones en tiempo real del estado del pedido
- **Reseñas y Calificaciones**: Compartir comentarios y ver reseñas de otros clientes
- **Diseño Responsivo**: Optimizado para todos los dispositivos (móvil, tablet, escritorio)

#### 👨‍💼 **Funciones del Panel de Administración**
- **Análisis del Dashboard**: Información completa del negocio y estadísticas
- **Gestión de Productos**: Agregar, editar y gestionar el inventario de pasteles
- **Gestión de Pedidos**: Procesar y rastrear todos los pedidos de clientes
- **Gestión de Clientes**: Ver y administrar cuentas de clientes
- **Gestión de Personal**: Crear y administrar cuentas de personal
- **Pedidos de Diseño Personalizado**: Manejar solicitudes especiales de diseño de pasteles
- **Moderación de Reseñas**: Monitorear y gestionar comentarios de clientes

### 🛠️ Stack Tecnológico

#### **Backend**
- **Framework**: FastAPI 0.115.0
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth (JWT-based)
- **API**: Arquitectura API RESTful moderna
- **Validación**: Pydantic v2
- **CORS**: FastAPI Middleware

#### **Frontend - Portal del Cliente**
- **Framework**: Next.js 12.1.6
- **Estilos**: SASS (Syntactically Awesome Style Sheets)
- **Gestión de Estado**: Redux Toolkit
- **Componentes UI**: Material-UI, React Slick
- **Responsivo**: Enfoque mobile-first

#### **Frontend - Panel de Administración**
- **Framework**: React 18.1.0
- **Librería UI**: Material-UI (MUI)
- **Gestión de Estado**: Redux Toolkit
- **Visualización de Datos**: Recharts para análisis
- **Componentes**: MUI Data Grid, Iconos

## 📸 Capturas de Pantalla del Proyecto

### Dashboard de Administración
![AdminPanel_Dashboard_1](https://user-images.githubusercontent.com/83922375/189864191-a2d9c12e-043e-4dbc-ba8c-7771a8a6ecbb.png)

### Página de Inicio del Cliente
![LandingPage](https://user-images.githubusercontent.com/83922375/189864239-28bbefd3-6fb1-4ff2-a199-b21c75143e9e.png)

> 📁 Más capturas de pantalla disponibles en la carpeta `ProjectOutput/`

## 🚀 Inicio Rápido

### Prerequisitos

Asegúrate de tener lo siguiente instalado:
- **Python 3.8+** 
- **Node.js 14+** y **npm**
- **Git**

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/your-username/pasteleria-mil-sabores.git
   cd pasteleria-mil-sabores
   ```

2. **Configuración del Backend (FastAPI + Supabase)**
   ```bash
   # Navegar al directorio del backend
   cd backend
   
   # Crear entorno virtual (recomendado)
   python3 -m venv venv
   source venv/bin/activate  # En macOS/Linux
   # venv\Scripts\activate   # En Windows
   
   # Instalar dependencias
   pip install -r requirements.txt
   
   # Configurar variables de entorno
   # Crear archivo .env con tus credenciales de Supabase:
   # SUPABASE_URL=tu_supabase_url
   # SUPABASE_KEY=tu_supabase_key
   
   # Iniciar servidor FastAPI
   python3 server.py
   ```
   
   🌐 El Backend estará ejecutándose en: `http://localhost:8000`
   📚 Documentación API en: `http://localhost:8000/docs`

3. **Configuración del Frontend del Cliente (Next.js)**
   ```bash
   # Abrir nueva terminal
   cd customer-frontend
   
   # Instalar dependencias
   npm install
   
   # Iniciar servidor de desarrollo
   npm run dev
   ```
   
   🌐 El portal del cliente estará ejecutándose en: `http://localhost:3000`

4. **Configuración del Frontend de Administración (React)**
   ```bash
   # Abrir nueva terminal
   cd admin_frontend
   
   # Instalar dependencias
   npm install
   
   # Iniciar servidor de desarrollo
   npm start
   ```
   
   🌐 El panel de administración estará ejecutándose en: `http://localhost:3001`

## 📋 Scripts Disponibles

### Comandos del Backend
```bash
python manage.py runserver          # Iniciar servidor de desarrollo
python manage.py makemigrations     # Crear nuevas migraciones
python manage.py migrate            # Aplicar migraciones
python manage.py createsuperuser    # Crear usuario administrador
python manage.py collectstatic      # Recopilar archivos estáticos
```

### Comandos del Frontend
```bash
# Frontend del Cliente
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm start        # Iniciar servidor de producción

# Frontend de Administración
npm start        # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm test         # Ejecutar pruebas
```

## 🏗️ Estructura del Proyecto

```
├── 📁 backend/                 # API REST de FastAPI
│   ├── 📁 routers/            # Endpoints de la API
│   │   ├── users.py           # Autenticación y usuarios
│   │   ├── products.py        # Gestión de productos
│   │   └── reviews.py         # Reseñas y feedback
│   ├── server.py              # Aplicación FastAPI principal
│   ├── .env                   # Variables de entorno (Supabase)
│   └── requirements.txt       # Dependencias Python
├── 📁 customer-frontend/       # Portal del cliente Next.js
├── 📁 admin_frontend/         # Panel de administración React
└── 📁 ProjectOutput/          # Galería de capturas de pantalla
```

## 🔑 Endpoints Principales de la API

```
POST   /api/users/login              # Autenticación de usuario
POST   /api/users/register           # Registro de usuario
GET    /api/users/get_user           # Obtener datos del usuario
POST   /api/users/logout             # Cerrar sesión
GET    /api/products/                # Obtener todos los productos
POST   /api/products/                # Crear nuevo producto
GET    /api/feedback/                # Obtener reseñas
POST   /api/feedback/                # Enviar reseña
```

Documentación completa disponible en: `http://localhost:8000/docs`

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` en el directorio backend:

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key
```

Para obtener tus credenciales de Supabase:
1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings → API
4. Copia la URL del proyecto y la clave anon/public

### Configuración de Base de Datos
El proyecto usa Supabase (PostgreSQL) para la base de datos. Consulta `backend/README.md` para instrucciones detalladas de configuración del schema.

## 🚀 Despliegue

### Configuración de Producción
1. Configurar variables de entorno en el servicio de hosting
2. Usar credenciales de Supabase de producción
3. Configurar CORS para dominios de producción
4. Configurar servicio de archivos estáticos para el frontend

### Hosting Recomendado
- **Backend**: Railway, Render, Fly.io, AWS Lambda
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Base de Datos**: Supabase (incluye PostgreSQL + Auth)

## 🤝 Contribuir

¡Damos la bienvenida a las contribuciones! Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama de funcionalidad (`git checkout -b feature/CaracteristicaIncreible`)
3. Confirma tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Empuja a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

## � Autores

Este proyecto fue desarrollado por:

- **Tomás Cárdenas**
- **Sebastián García**
- **Gaspar Jiménez**
- **Pedro Muñoz**
- **Daniela Novoa**
- **Mirko Peñailillo**
- **Franco Ponce**

## �📜 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

Para soporte y preguntas:
- 📧 Email: soporte@pasteleriamilsabores.com
- 💬 Issues: [GitHub Issues](https://github.com/your-username/pasteleria-mil-sabores/issues)

## 🔄 Historial de Versiones

- **v1.0.0** - Lanzamiento inicial con funcionalidad principal
- **v1.1.0** - Agregada función de diseño de pasteles personalizado
- **v1.2.0** - Mejorado dashboard de análisis del administrador
- **v2.0.0** - 🔜 **Próximamente**: Migración completa a Firebase con nuevas funcionalidades y diseño renovado

---

**Hecho con ❤️ para los amantes de pasteles en todo el mundo** 🍰
