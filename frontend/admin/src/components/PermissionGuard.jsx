/**
 * Componente de Orden Superior (HOC) para proteger rutas con permisos
 * Verifica que el usuario tenga los permisos necesarios antes de renderizar el componente
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { Alert, Box, Container } from '@mui/material';
import { Lock } from '@mui/icons-material';

/**
 * HOC que requiere un permiso específico
 * @param {React.Component} Component - Componente a proteger
 * @param {string} requiredPermission - Permiso requerido
 */
export const withPermission = (Component, requiredPermission) => {
  return (props) => {
    const { checkPermission, isAdmin } = usePermissions();

    // Los administradores tienen acceso a todo
    if (isAdmin()) {
      return <Component {...props} />;
    }

    // Verificar si tiene el permiso requerido
    if (checkPermission(requiredPermission)) {
      return <Component {...props} />;
    }

    // No tiene permiso
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <Lock sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            <strong>Acceso Denegado</strong>
          </Alert>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No tienes permisos para acceder a esta sección.
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
            Permiso requerido: <strong>{requiredPermission}</strong>
          </p>
        </Box>
      </Container>
    );
  };
};

/**
 * HOC que requiere al menos uno de varios permisos
 * @param {React.Component} Component - Componente a proteger
 * @param {string[]} requiredPermissions - Array de permisos (con al menos uno es suficiente)
 */
export const withAnyPermission = (Component, requiredPermissions) => {
  return (props) => {
    const { checkAnyPermission, isAdmin } = usePermissions();

    if (isAdmin() || checkAnyPermission(requiredPermissions)) {
      return <Component {...props} />;
    }

    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <Lock sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            <strong>Acceso Denegado</strong>
          </Alert>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No tienes permisos para acceder a esta sección.
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
            Se requiere al menos uno de estos permisos: <br />
            <strong>{requiredPermissions.join(', ')}</strong>
          </p>
        </Box>
      </Container>
    );
  };
};

/**
 * HOC que requiere todos los permisos especificados
 * @param {React.Component} Component - Componente a proteger
 * @param {string[]} requiredPermissions - Array de permisos (se requieren todos)
 */
export const withAllPermissions = (Component, requiredPermissions) => {
  return (props) => {
    const { checkAllPermissions, isAdmin } = usePermissions();

    if (isAdmin() || checkAllPermissions(requiredPermissions)) {
      return <Component {...props} />;
    }

    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <Lock sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            <strong>Acceso Denegado</strong>
          </Alert>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No tienes permisos suficientes para acceder a esta sección.
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
            Se requieren todos estos permisos: <br />
            <strong>{requiredPermissions.join(', ')}</strong>
          </p>
        </Box>
      </Container>
    );
  };
};

/**
 * Componente para renderizar condicionalmente según permisos
 */
export const PermissionGuard = ({ permission, permissions, requireAll = false, fallback = null, children }) => {
  const { checkPermission, checkAnyPermission, checkAllPermissions, isAdmin } = usePermissions();

  if (isAdmin()) {
    return <>{children}</>;
  }

  // Verificación de permiso único
  if (permission && checkPermission(permission)) {
    return <>{children}</>;
  }

  // Verificación de múltiples permisos
  if (permissions) {
    if (requireAll && checkAllPermissions(permissions)) {
      return <>{children}</>;
    }
    if (!requireAll && checkAnyPermission(permissions)) {
      return <>{children}</>;
    }
  }

  return fallback;
};
