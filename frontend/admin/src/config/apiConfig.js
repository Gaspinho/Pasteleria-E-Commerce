/* ============================================
   API CONFIGURATION
   Centralized configuration for backend API
   ============================================ */

// ============================================
// Development Configuration (SQLite Backend)
// ============================================
const DEV_CONFIG = {
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================
// Production Configuration (PostgreSQL Backend)
// ============================================
const PROD_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://your-production-domain.com/api/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// ============================================
// Environment Detection
// ============================================
const isProduction = process.env.NODE_ENV === 'production';
const API_CONFIG = isProduction ? PROD_CONFIG : DEV_CONFIG;

// ============================================
// API Endpoints
// ============================================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: 'user/login/',
  REGISTER: 'user/register/',
  REGISTER_STAFF: 'user/registerStaff/',
  LOGOUT: 'user/logout/',
  
  // Users
  USERS_LIST: 'user/users/',
  USER_DETAIL: (id) => `user/users/${id}/`,
  USER_PROFILE: 'user/profile/',
  
  // Products
  PRODUCTS_LIST: 'product/products/',
  PRODUCT_DETAIL: (id) => `product/products/${id}/`,
  PRODUCT_CREATE: 'product/products/',
  PRODUCT_UPDATE: (id) => `product/products/${id}/`,
  PRODUCT_DELETE: (id) => `product/products/${id}/`,
  
  // Orders
  ORDERS_LIST: 'order/orders/',
  ORDER_DETAIL: (id) => `order/orders/${id}/`,
  ORDER_CREATE: 'order/orders/',
  ORDER_UPDATE: (id) => `order/orders/${id}/`,
  ORDER_DELETE: (id) => `order/orders/${id}/`,
  
  // Custom Orders
  CUSTOM_ORDERS_LIST: 'customizeorder/custom-orders/',
  CUSTOM_ORDER_DETAIL: (id) => `customizeorder/custom-orders/${id}/`,
  
  // Feedback
  FEEDBACKS_LIST: 'feedback/feedbacks/',
  FEEDBACK_DETAIL: (id) => `feedback/feedbacks/${id}/`,
  
  // Dashboard Stats
  DASHBOARD_STATS: 'base/dashboard/stats/',
};

// ============================================
// Request Helper Functions
// ============================================

/**
 * Get authorization headers with JWT token
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Build full API URL
 */
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error Response:', error.response.data);
    return {
      status: error.response.status,
      message: error.response.data.message || 'Server error occurred',
      errors: error.response.data.errors || {},
    };
  } else if (error.request) {
    // Request made but no response
    console.error('API No Response:', error.request);
    return {
      status: 0,
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Error in request setup
    console.error('API Request Error:', error.message);
    return {
      status: -1,
      message: error.message || 'Request failed',
    };
  }
};

// ============================================
// Export Configuration
// ============================================
export default API_CONFIG;

/* ============================================
   USAGE EXAMPLES
   ============================================

   // Basic fetch request
   import API_CONFIG, { API_ENDPOINTS, getAuthHeaders, buildApiUrl } from './apiConfig';

   const fetchProducts = async () => {
     try {
       const response = await fetch(
         buildApiUrl(API_ENDPOINTS.PRODUCTS_LIST),
         {
           method: 'GET',
           headers: getAuthHeaders(),
         }
       );
       const data = await response.json();
       return data;
     } catch (error) {
       console.error('Error fetching products:', error);
     }
   };

   // Using with RTK Query
   import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
   import API_CONFIG, { getAuthHeaders } from './apiConfig';

   export const api = createApi({
     baseQuery: fetchBaseQuery({
       baseUrl: API_CONFIG.baseURL,
       prepareHeaders: (headers) => {
         const authHeaders = getAuthHeaders();
         Object.entries(authHeaders).forEach(([key, value]) => {
           headers.set(key, value);
         });
         return headers;
       },
     }),
     endpoints: (builder) => ({
       // Define endpoints here
     }),
   });

   ============================================ */

/* ============================================
   POSTGRESQL BACKEND CONFIGURATION
   ============================================

   When switching to PostgreSQL backend:

   1. Create .env file in admin_frontend root:
      REACT_APP_API_URL=http://your-server.com/api/
      REACT_APP_ENV=production

   2. For different environments:
      # Development
      REACT_APP_API_URL=http://127.0.0.1:8000/
      REACT_APP_ENV=development

      # Staging
      REACT_APP_API_URL=https://staging.yourapp.com/api/
      REACT_APP_ENV=staging

      # Production
      REACT_APP_API_URL=https://api.yourapp.com/
      REACT_APP_ENV=production

   3. Update package.json scripts:
      "scripts": {
        "start": "react-scripts start",
        "start:prod": "REACT_APP_ENV=production react-scripts start",
        "build": "react-scripts build",
        "build:staging": "REACT_APP_ENV=staging react-scripts build"
      }

   4. Backend CORS Configuration (Django settings.py):
      CORS_ALLOWED_ORIGINS = [
          "http://localhost:3000",
          "http://localhost:3001",
          "https://your-production-domain.com",
          "https://admin.your-production-domain.com",
      ]

   5. Nginx Configuration Example (if using):
      location /api/ {
          proxy_pass http://localhost:8000/;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

   ============================================ */
