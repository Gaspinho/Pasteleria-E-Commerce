/**
 * Sistema de Permisos Personalizados
 * Define todos los permisos disponibles en el sistema
 */

// Categorías de permisos
export const PERMISSION_CATEGORIES = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOM_ORDERS: 'custom_orders',
  REVIEWS: 'reviews',
  SALES: 'sales',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings'
};

// Acciones de permisos
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
  MANAGE: 'manage'
};

// Lista completa de permisos del sistema
export const PERMISSIONS = {
  // Permisos de Usuarios
  USERS_VIEW: { 
    id: 'users.view', 
    name: 'Ver Usuarios', 
    description: 'Permite ver la lista de usuarios y sus detalles',
    category: PERMISSION_CATEGORIES.USERS 
  },
  USERS_CREATE: { 
    id: 'users.create', 
    name: 'Crear Usuarios', 
    description: 'Permite crear nuevos usuarios en el sistema',
    category: PERMISSION_CATEGORIES.USERS 
  },
  USERS_EDIT: { 
    id: 'users.edit', 
    name: 'Editar Usuarios', 
    description: 'Permite modificar información de usuarios existentes',
    category: PERMISSION_CATEGORIES.USERS 
  },
  USERS_DELETE: { 
    id: 'users.delete', 
    name: 'Eliminar Usuarios', 
    description: 'Permite eliminar usuarios del sistema',
    category: PERMISSION_CATEGORIES.USERS 
  },
  USERS_EXPORT: { 
    id: 'users.export', 
    name: 'Exportar Usuarios', 
    description: 'Permite exportar datos de usuarios',
    category: PERMISSION_CATEGORIES.USERS 
  },

  // Permisos de Productos
  PRODUCTS_VIEW: { 
    id: 'products.view', 
    name: 'Ver Productos', 
    description: 'Permite ver el catálogo de productos',
    category: PERMISSION_CATEGORIES.PRODUCTS 
  },
  PRODUCTS_CREATE: { 
    id: 'products.create', 
    name: 'Crear Productos', 
    description: 'Permite agregar nuevos productos al catálogo',
    category: PERMISSION_CATEGORIES.PRODUCTS 
  },
  PRODUCTS_EDIT: { 
    id: 'products.edit', 
    name: 'Editar Productos', 
    description: 'Permite modificar productos existentes',
    category: PERMISSION_CATEGORIES.PRODUCTS 
  },
  PRODUCTS_DELETE: { 
    id: 'products.delete', 
    name: 'Eliminar Productos', 
    description: 'Permite eliminar productos del catálogo',
    category: PERMISSION_CATEGORIES.PRODUCTS 
  },
  PRODUCTS_MANAGE_INVENTORY: { 
    id: 'products.manage_inventory', 
    name: 'Gestionar Inventario', 
    description: 'Permite gestionar stock y precios de productos',
    category: PERMISSION_CATEGORIES.PRODUCTS 
  },

  // Permisos de Órdenes
  ORDERS_VIEW: { 
    id: 'orders.view', 
    name: 'Ver Órdenes', 
    description: 'Permite ver todas las órdenes del sistema',
    category: PERMISSION_CATEGORIES.ORDERS 
  },
  ORDERS_EDIT: { 
    id: 'orders.edit', 
    name: 'Editar Órdenes', 
    description: 'Permite modificar órdenes existentes',
    category: PERMISSION_CATEGORIES.ORDERS 
  },
  ORDERS_UPDATE_STATUS: { 
    id: 'orders.update_status', 
    name: 'Actualizar Estado', 
    description: 'Permite cambiar el estado de las órdenes',
    category: PERMISSION_CATEGORIES.ORDERS 
  },
  ORDERS_DELETE: { 
    id: 'orders.delete', 
    name: 'Eliminar Órdenes', 
    description: 'Permite eliminar órdenes del sistema',
    category: PERMISSION_CATEGORIES.ORDERS 
  },
  ORDERS_EXPORT: { 
    id: 'orders.export', 
    name: 'Exportar Órdenes', 
    description: 'Permite exportar datos de órdenes',
    category: PERMISSION_CATEGORIES.ORDERS 
  },

  // Permisos de Órdenes Personalizadas
  CUSTOM_ORDERS_VIEW: { 
    id: 'custom_orders.view', 
    name: 'Ver Órdenes Personalizadas', 
    description: 'Permite ver órdenes de pasteles personalizados',
    category: PERMISSION_CATEGORIES.CUSTOM_ORDERS 
  },
  CUSTOM_ORDERS_EDIT: { 
    id: 'custom_orders.edit', 
    name: 'Editar Órdenes Personalizadas', 
    description: 'Permite modificar órdenes personalizadas',
    category: PERMISSION_CATEGORIES.CUSTOM_ORDERS 
  },
  CUSTOM_ORDERS_UPDATE_STATUS: { 
    id: 'custom_orders.update_status', 
    name: 'Actualizar Estado Personalizado', 
    description: 'Permite cambiar el estado de órdenes personalizadas',
    category: PERMISSION_CATEGORIES.CUSTOM_ORDERS 
  },
  CUSTOM_ORDERS_DELETE: { 
    id: 'custom_orders.delete', 
    name: 'Eliminar Órdenes Personalizadas', 
    description: 'Permite eliminar órdenes personalizadas',
    category: PERMISSION_CATEGORIES.CUSTOM_ORDERS 
  },

  // Permisos de Reseñas y Preguntas
  REVIEWS_VIEW: { 
    id: 'reviews.view', 
    name: 'Ver Reseñas', 
    description: 'Permite ver todas las reseñas y preguntas',
    category: PERMISSION_CATEGORIES.REVIEWS 
  },
  REVIEWS_DELETE: { 
    id: 'reviews.delete', 
    name: 'Eliminar Reseñas', 
    description: 'Permite eliminar reseñas y preguntas',
    category: PERMISSION_CATEGORIES.REVIEWS 
  },
  REVIEWS_MODERATE: { 
    id: 'reviews.moderate', 
    name: 'Moderar Reseñas', 
    description: 'Permite aprobar o rechazar reseñas',
    category: PERMISSION_CATEGORIES.REVIEWS 
  },

  // Permisos de Ventas
  SALES_VIEW: { 
    id: 'sales.view', 
    name: 'Ver Ventas', 
    description: 'Permite ver reportes de ventas',
    category: PERMISSION_CATEGORIES.SALES 
  },
  SALES_EXPORT: { 
    id: 'sales.export', 
    name: 'Exportar Ventas', 
    description: 'Permite exportar reportes de ventas',
    category: PERMISSION_CATEGORIES.SALES 
  },
  SALES_ANALYTICS: { 
    id: 'sales.analytics', 
    name: 'Ver Analíticas', 
    description: 'Permite acceder a analíticas avanzadas',
    category: PERMISSION_CATEGORIES.SALES 
  },

  // Permisos de Dashboard
  DASHBOARD_VIEW: { 
    id: 'dashboard.view', 
    name: 'Ver Dashboard', 
    description: 'Permite acceder al panel principal',
    category: PERMISSION_CATEGORIES.DASHBOARD 
  },
  DASHBOARD_FULL_ANALYTICS: { 
    id: 'dashboard.full_analytics', 
    name: 'Analíticas Completas', 
    description: 'Permite ver todas las métricas del dashboard',
    category: PERMISSION_CATEGORIES.DASHBOARD 
  },

  // Permisos de Configuración
  SETTINGS_VIEW: { 
    id: 'settings.view', 
    name: 'Ver Configuración', 
    description: 'Permite ver la configuración del sistema',
    category: PERMISSION_CATEGORIES.SETTINGS 
  },
  SETTINGS_EDIT: { 
    id: 'settings.edit', 
    name: 'Editar Configuración', 
    description: 'Permite modificar la configuración del sistema',
    category: PERMISSION_CATEGORIES.SETTINGS 
  },
  SETTINGS_MANAGE_ROLES: { 
    id: 'settings.manage_roles', 
    name: 'Gestionar Roles', 
    description: 'Permite crear y editar roles y permisos',
    category: PERMISSION_CATEGORIES.SETTINGS 
  }
};

// Roles predefinidos del sistema
export const DEFAULT_ROLES = {
  ADMIN: {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades',
    permissions: Object.keys(PERMISSIONS).map(key => PERMISSIONS[key].id),
    isSystem: true,
    color: '#DC143C'
  },
  MANAGER: {
    id: 'manager',
    name: 'Gerente',
    description: 'Gestión de productos, órdenes y personal',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW.id,
      PERMISSIONS.DASHBOARD_FULL_ANALYTICS.id,
      PERMISSIONS.USERS_VIEW.id,
      PERMISSIONS.USERS_CREATE.id,
      PERMISSIONS.USERS_EDIT.id,
      PERMISSIONS.PRODUCTS_VIEW.id,
      PERMISSIONS.PRODUCTS_CREATE.id,
      PERMISSIONS.PRODUCTS_EDIT.id,
      PERMISSIONS.PRODUCTS_MANAGE_INVENTORY.id,
      PERMISSIONS.ORDERS_VIEW.id,
      PERMISSIONS.ORDERS_EDIT.id,
      PERMISSIONS.ORDERS_UPDATE_STATUS.id,
      PERMISSIONS.ORDERS_EXPORT.id,
      PERMISSIONS.CUSTOM_ORDERS_VIEW.id,
      PERMISSIONS.CUSTOM_ORDERS_EDIT.id,
      PERMISSIONS.CUSTOM_ORDERS_UPDATE_STATUS.id,
      PERMISSIONS.REVIEWS_VIEW.id,
      PERMISSIONS.REVIEWS_MODERATE.id,
      PERMISSIONS.SALES_VIEW.id,
      PERMISSIONS.SALES_EXPORT.id,
      PERMISSIONS.SALES_ANALYTICS.id
    ],
    isSystem: true,
    color: '#FF8C00'
  },
  STAFF: {
    id: 'staff',
    name: 'Personal',
    description: 'Gestión de órdenes y productos básico',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW.id,
      PERMISSIONS.PRODUCTS_VIEW.id,
      PERMISSIONS.PRODUCTS_EDIT.id,
      PERMISSIONS.ORDERS_VIEW.id,
      PERMISSIONS.ORDERS_UPDATE_STATUS.id,
      PERMISSIONS.CUSTOM_ORDERS_VIEW.id,
      PERMISSIONS.CUSTOM_ORDERS_UPDATE_STATUS.id,
      PERMISSIONS.REVIEWS_VIEW.id
    ],
    isSystem: true,
    color: '#4169E1'
  },
  DELIVERY_BOY: {
    id: 'delivery_boy',
    name: 'Repartidor',
    description: 'Ver y actualizar estado de órdenes asignadas',
    permissions: [
      PERMISSIONS.ORDERS_VIEW.id,
      PERMISSIONS.ORDERS_UPDATE_STATUS.id,
      PERMISSIONS.CUSTOM_ORDERS_VIEW.id,
      PERMISSIONS.CUSTOM_ORDERS_UPDATE_STATUS.id
    ],
    isSystem: true,
    color: '#32CD32'
  },
  CUSTOMER_SERVICE: {
    id: 'customer_service',
    name: 'Servicio al Cliente',
    description: 'Atención al cliente y gestión de reseñas',
    permissions: [
      PERMISSIONS.USERS_VIEW.id,
      PERMISSIONS.ORDERS_VIEW.id,
      PERMISSIONS.CUSTOM_ORDERS_VIEW.id,
      PERMISSIONS.REVIEWS_VIEW.id,
      PERMISSIONS.REVIEWS_MODERATE.id,
      PERMISSIONS.PRODUCTS_VIEW.id
    ],
    isSystem: false,
    color: '#9370DB'
  }
};

// Obtener permisos por categoría
export const getPermissionsByCategory = (category) => {
  return Object.values(PERMISSIONS).filter(
    permission => permission.category === category
  );
};

// Verificar si un usuario tiene un permiso específico
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
};

// Verificar si un usuario tiene alguno de los permisos requeridos
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

// Verificar si un usuario tiene todos los permisos requeridos
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

// Obtener nombre de categoría en español
export const getCategoryName = (category) => {
  const categoryNames = {
    [PERMISSION_CATEGORIES.USERS]: 'Usuarios',
    [PERMISSION_CATEGORIES.PRODUCTS]: 'Productos',
    [PERMISSION_CATEGORIES.ORDERS]: 'Órdenes',
    [PERMISSION_CATEGORIES.CUSTOM_ORDERS]: 'Órdenes Personalizadas',
    [PERMISSION_CATEGORIES.REVIEWS]: 'Reseñas y Preguntas',
    [PERMISSION_CATEGORIES.SALES]: 'Ventas',
    [PERMISSION_CATEGORIES.DASHBOARD]: 'Dashboard',
    [PERMISSION_CATEGORIES.SETTINGS]: 'Configuración'
  };
  return categoryNames[category] || category;
};
