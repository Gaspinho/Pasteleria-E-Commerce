# Sistema de Roles y Permisos Personalizados

## Descripción General

El sistema de Roles y Permisos permite crear y gestionar roles personalizados con permisos granulares para controlar el acceso de diferentes usuarios del personal a las funcionalidades del panel administrativo.

## Características Principales

### 1. Gestión de Roles
- **Roles Predefinidos**: Admin, Manager, Staff, Delivery Boy, Customer Service
- **Roles Personalizados**: Crea roles específicos según las necesidades del negocio
- **Asignación Visual**: Cada rol tiene un color distintivo para fácil identificación
- **Protección de Roles del Sistema**: Los roles predefinidos no pueden ser eliminados

### 2. Sistema de Permisos Granular

El sistema incluye 8 categorías de permisos:

#### Usuarios (`users`)
- `users.view` - Ver lista de usuarios
- `users.create` - Crear nuevos usuarios
- `users.edit` - Editar información de usuarios
- `users.delete` - Eliminar usuarios
- `users.export` - Exportar datos de usuarios

#### Productos (`products`)
- `products.view` - Ver catálogo de productos
- `products.create` - Crear nuevos productos
- `products.edit` - Editar productos existentes
- `products.delete` - Eliminar productos
- `products.manage_inventory` - Gestionar inventario y precios

#### Órdenes (`orders`)
- `orders.view` - Ver todas las órdenes
- `orders.edit` - Editar órdenes
- `orders.update_status` - Cambiar estado de órdenes
- `orders.delete` - Eliminar órdenes
- `orders.export` - Exportar datos de órdenes

#### Órdenes Personalizadas (`custom_orders`)
- `custom_orders.view` - Ver órdenes personalizadas
- `custom_orders.edit` - Editar órdenes personalizadas
- `custom_orders.update_status` - Actualizar estado
- `custom_orders.delete` - Eliminar órdenes personalizadas

#### Reseñas y Preguntas (`reviews`)
- `reviews.view` - Ver reseñas y preguntas
- `reviews.delete` - Eliminar reseñas
- `reviews.moderate` - Aprobar/rechazar reseñas

#### Ventas (`sales`)
- `sales.view` - Ver reportes de ventas
- `sales.export` - Exportar reportes
- `sales.analytics` - Acceder a analíticas avanzadas

#### Dashboard (`dashboard`)
- `dashboard.view` - Acceder al panel principal
- `dashboard.full_analytics` - Ver todas las métricas

#### Configuración (`settings`)
- `settings.view` - Ver configuración del sistema
- `settings.edit` - Modificar configuración
- `settings.manage_roles` - Gestionar roles y permisos

## Uso del Sistema

### Crear un Rol Personalizado

1. Navega a **Roles y Permisos** en el menú lateral
2. Haz clic en **"Crear Rol Personalizado"**
3. Completa la información:
   - **Nombre del Rol**: Nombre descriptivo (ej: "Supervisor de Ventas")
   - **Descripción**: Breve descripción de las responsabilidades
   - **Color**: Selecciona un color para identificar visualmente el rol
4. Selecciona los permisos:
   - Expande cada categoría de permisos
   - Marca los permisos específicos que necesita el rol
   - Usa el checkbox de la categoría para seleccionar/deseleccionar todos
5. Haz clic en **"Crear Rol"**

### Asignar un Rol a un Usuario

1. Ve a **Personal** → **Crear Usuario** o edita un usuario existente
2. En el campo **"Rol y Permisos"**, selecciona el rol apropiado
3. Verás una vista previa de los permisos incluidos en ese rol
4. Guarda los cambios

### Editar un Rol Existente

- **Roles Personalizados**: Puedes editarlos directamente haciendo clic en el botón de editar
- **Roles del Sistema**: Al intentar editarlos, se te ofrecerá crear una copia personalizada

## Implementación Técnica

### Estructura de Archivos

```
src/
├── constants/
│   └── permissions.js          # Definición de permisos y roles
├── features/
│   └── rolesSlice.js          # Redux slice para roles
├── hooks/
│   └── usePermissions.js      # Hook personalizado para verificar permisos
├── components/
│   └── PermissionGuard.jsx    # HOCs y componentes para protección
└── pages/
    └── roles/
        ├── RolesPermissions.jsx
        └── rolesPermissions.css
```

### Uso en Componentes

#### Proteger una Ruta Completa

```jsx
import { withPermission } from '../components/PermissionGuard';
import { PERMISSIONS } from '../constants/permissions';

const MyComponent = () => {
  return <div>Contenido protegido</div>;
};

export default withPermission(MyComponent, PERMISSIONS.PRODUCTS_CREATE.id);
```

#### Renderizado Condicional

```jsx
import { PermissionGuard } from '../components/PermissionGuard';
import { PERMISSIONS } from '../constants/permissions';

function MyComponent() {
  return (
    <div>
      <PermissionGuard permission={PERMISSIONS.USERS_DELETE.id}>
        <button>Eliminar Usuario</button>
      </PermissionGuard>
    </div>
  );
}
```

#### Verificación Programática

```jsx
import { usePermissions } from '../hooks/usePermissions';
import { PERMISSIONS } from '../constants/permissions';

function MyComponent() {
  const { checkPermission, isAdmin } = usePermissions();

  const handleDelete = () => {
    if (checkPermission(PERMISSIONS.USERS_DELETE.id) || isAdmin()) {
      // Realizar acción de eliminación
    }
  };

  return <button onClick={handleDelete}>Eliminar</button>;
}
```

## Roles Predefinidos

### Administrador
- **Permisos**: Todos los permisos del sistema
- **Uso**: Propietarios del negocio, administradores principales
- **Color**: Rojo (#DC143C)

### Gerente
- **Permisos**: Gestión completa excepto configuración del sistema
- **Uso**: Gerentes de tienda, supervisores
- **Color**: Naranja (#FF8C00)

### Staff
- **Permisos**: Gestión básica de órdenes y productos
- **Uso**: Personal de ventas, asistentes
- **Color**: Azul (#4169E1)

### Repartidor
- **Permisos**: Ver y actualizar estado de órdenes
- **Uso**: Personal de entrega
- **Color**: Verde (#32CD32)

### Servicio al Cliente
- **Permisos**: Atención al cliente, gestión de reseñas
- **Uso**: Equipo de soporte
- **Color**: Púrpura (#9370DB)

## Mejores Prácticas

1. **Principio de Menor Privilegio**: Asigna solo los permisos necesarios
2. **Revisión Regular**: Revisa periódicamente los roles y permisos asignados
3. **Documentación**: Documenta el propósito de cada rol personalizado
4. **Nombres Descriptivos**: Usa nombres claros que indiquen la función del rol
5. **Colores Únicos**: Asigna colores distintivos para facilitar la identificación

## Seguridad

- Los administradores tienen acceso completo y no pueden ser restringidos
- Los roles del sistema están protegidos contra eliminación
- La verificación de permisos se realiza tanto en frontend como backend
- Los permisos se almacenan en Redux y se sincronizan con el estado de autenticación

## Integración con Backend

El sistema está diseñado para integrarse con un backend que almacene:
- Roles de usuario en la tabla `app_user` (campo `role`)
- Permisos asociados a cada rol
- Validación de permisos en cada endpoint

## Próximas Mejoras

- [ ] Persistencia de roles personalizados en base de datos
- [ ] Historial de cambios de permisos
- [ ] Notificaciones de cambios de rol
- [ ] Exportación/importación de configuraciones de roles
- [ ] Dashboard de uso de permisos
- [ ] Auditoría de acciones por rol

## Soporte

Para dudas o problemas con el sistema de permisos, contacta al equipo de desarrollo o consulta la documentación técnica completa.
