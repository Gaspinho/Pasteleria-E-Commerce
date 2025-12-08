# 🍰 Pastelería Mil Sabores - Frontend Unificado

Este directorio contiene ambos frontends de la plataforma:

## 📁 Estructura

```
frontend/
├── customer/          # Portal del Cliente (Next.js)
├── admin/            # Panel de Administración (React)
├── package.json      # Configuración raíz
└── README.md         # Este archivo
```

## 🚀 Inicio Rápido

### Instalación

Instalar todas las dependencias de ambos proyectos:

```bash
npm run install:all
```

O instalar individualmente:

```bash
# Frontend del Cliente
cd customer
npm install

# Panel de Administración
cd admin
npm install
```

### Desarrollo

**Ejecutar ambos frontends simultáneamente:**

```bash
npm run dev
```

Esto iniciará:
- 🌐 Portal del Cliente en: `http://localhost:3000`
- 👨‍💼 Panel de Administración en: `http://localhost:3001`

**Ejecutar individualmente:**

```bash
# Solo Portal del Cliente
npm run dev:customer

# Solo Panel de Administración
npm run dev:admin
```

### Producción

**Compilar ambos proyectos:**

```bash
npm run build
```

**Compilar individualmente:**

```bash
npm run build:customer  # Compilar portal del cliente
npm run build:admin     # Compilar panel de administración
```

**Iniciar en modo producción:**

```bash
npm run start:customer  # Iniciar portal del cliente
npm run start:admin     # Iniciar panel de administración
```

## 📦 Proyectos

### Portal del Cliente (`customer/`)

- **Framework:** Next.js 12.1.6
- **Estilos:** SASS
- **Estado:** Redux Toolkit
- **Puerto:** 3000

Características:
- Catálogo de productos
- Diseñador de pasteles personalizado
- Carrito de compras
- Autenticación de usuarios
- Perfil y pedidos

[Ver documentación completa →](./customer/README.md)

### Panel de Administración (`admin/`)

- **Framework:** React 18.1.0
- **UI:** Material-UI
- **Estado:** Redux Toolkit
- **Puerto:** 3001

Características:
- Dashboard de análisis
- Gestión de productos
- Gestión de pedidos
- Gestión de clientes
- Gestión de personal
- Pedidos personalizados

[Ver documentación completa →](./admin/README.md)

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run install:all` | Instalar dependencias de ambos proyectos |
| `npm run dev` | Iniciar ambos frontends en desarrollo |
| `npm run dev:customer` | Iniciar solo portal del cliente |
| `npm run dev:admin` | Iniciar solo panel de administración |
| `npm run build` | Compilar ambos proyectos |
| `npm run build:customer` | Compilar portal del cliente |
| `npm run build:admin` | Compilar panel de administración |
| `npm run test` | Ejecutar pruebas de ambos proyectos |

## 🔧 Configuración

Cada proyecto mantiene su propia configuración:

- **customer/.env** - Variables de entorno del portal del cliente
- **admin/.env** - Variables de entorno del panel de administración

## 📝 Notas

- Ambos proyectos comparten los mismos servicios API en `/services`
- Ambos se conectan al mismo backend FastAPI
- Asegúrate de que el backend esté ejecutándose antes de iniciar los frontends

## 🤝 Contribuir

Para contribuir a cualquiera de los frontends:

1. Navega al directorio correspondiente (`customer/` o `admin/`)
2. Realiza tus cambios
3. Ejecuta las pruebas
4. Crea un pull request

---

**Hecho con ❤️ por el equipo de Pastelería Mil Sabores**
