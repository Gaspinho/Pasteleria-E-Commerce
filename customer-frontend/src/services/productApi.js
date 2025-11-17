import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
// Updated to use FastAPI + Supabase backend

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: () => {
        return {
          url: 'products/products',
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    detailedProduct: builder.query({
      query: (id) => {
        console.log('api', id);
        return {
          url: `products/products/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getProductBySku: builder.query({
      query: (sku) => {
        return {
          url: `products/products/sku/${sku}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getCategories: builder.query({
      query: () => {
        return {
          url: 'products/categories',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getProductsByCategory: builder.query({
      query: (category) => {
        return {
          url: `products/products?category=${category}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const {
  useGetAllProductQuery, 
  useDetailedProductQuery,
  useGetProductBySkuQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery
} = productApi