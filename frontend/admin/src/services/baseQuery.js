import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_CONFIG from '../config/apiConfig';

/**
 * Base query con manejo de autenticación y tokens expirados
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.baseURL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Base query con interceptor para manejar tokens expirados
 */
export const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Si el token ha expirado o es inválido
  if (result.error && (result.error.status === 401 || result.error.status === 500)) {
    const errorMessage = result.error.data?.detail || '';
    
    // Verificar si el error es por token expirado o inválido
    if (
      errorMessage.includes('token is expired') ||
      errorMessage.includes('invalid JWT') ||
      errorMessage.includes('unable to parse or verify signature') ||
      result.error.status === 401
    ) {
      console.warn('Token expirado o inválido, redirigiendo al login...');
      
      // Limpiar tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('is_staff');
      sessionStorage.clear();
      
      // Redirigir al login
      window.location.href = '/login';
    }
  }

  return result;
};

export default baseQueryWithAuth;
