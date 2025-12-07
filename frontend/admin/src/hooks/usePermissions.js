/**
 * Hook personalizado para gestión de permisos
 * Proporciona funciones para verificar permisos del usuario actual
 */
import { useSelector } from 'react-redux';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../constants/permissions';

export const usePermissions = () => {
  const userPermissions = useSelector(state => state.roles?.userPermissions || []);
  const userRole = useSelector(state => state.roles?.userRole);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const checkPermission = (permission) => {
    return hasPermission(userPermissions, permission);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos dados
   */
  const checkAnyPermission = (permissions) => {
    return hasAnyPermission(userPermissions, permissions);
  };

  /**
   * Verifica si el usuario tiene todos los permisos dados
   */
  const checkAllPermissions = (permissions) => {
    return hasAllPermissions(userPermissions, permissions);
  };

  /**
   * Verifica si el usuario es administrador (tiene todos los permisos)
   */
  const isAdmin = () => {
    return userRole?.id === 'admin' || userRole?.name === 'Administrador';
  };

  return {
    userPermissions,
    userRole,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    isAdmin
  };
};
