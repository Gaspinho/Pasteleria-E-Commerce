# Frontend Cliente - Pastelería E-Commerce

Este es el frontend para clientes del proyecto de e-commerce de pastelería, construido con Next.js.

## 🚀 Inicio Rápido

### Configuración de Puertos

**IMPORTANTE**: Este proyecto usa puertos específicos para evitar conflictos:

- **Frontend Cliente**: Puerto **3000** (`http://localhost:3000`)
- **Panel Admin**: Puerto **3001** (`http://localhost:3001`)
- **Backend API**: Puerto **8000** (`http://localhost:8000`)

### Instalación

1. Instala las dependencias:
```bash
npm install
# o
yarn install
```

2. Verifica que existe el archivo `.env` con la configuración de puerto:
```env
PORT=3000
```

### Ejecutar en Desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Ejecutar en Producción

Para ejecutar el build de producción:

```bash
npm run build
npm run start
# o
yarn build
yarn start
```

## 📝 Nota para el Equipo

Si ambos frontends (admin y cliente) necesitan ejecutarse simultáneamente:

1. **Cliente** (este proyecto): `npm run dev` → Puerto 3000
2. **Admin**: `npm start` → Puerto 3001

Ambos pueden correr al mismo tiempo sin conflictos de puerto.
