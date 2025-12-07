import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithAuth from './baseQuery'

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    postProduct: builder.mutation({
      query: (productData) => {
        return {
          url: 'api/products/create',
          method: 'POST',
          body: productData,
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      invalidatesTags: ['Product']
    }),
    getAllProduct: builder.query({
      query: () => {
        return {
          url: 'product/getAllproduct',
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      providesTags: ['Product']
    }),
    updateProduct: builder.mutation({
      query:({ productData, id }) => {
        return {
          url: `api/products/products/${id}`,
          method: 'PUT',
          body: productData,
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      invalidatesTags: ['Product']
    }),
    detailedProduct: builder.query({
      query: (id) => {
        return {
          url: `product/getDetailedProduct/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      providesTags: (result, error, id) => [{ type: 'Product', id }]
    }),
    deleteProduct: builder.mutation({
      query:(productId) => {
        return {
          url: `product/delete/${productId}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      invalidatesTags: ['Product']
    }),
    getCategories: builder.query({
      query: () => {
        return {
          url: 'api/products/categories',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const { usePostProductMutation, useGetAllProductQuery, useUpdateProductMutation, 
  useDeleteProductMutation, useDetailedProductQuery, useGetCategoriesQuery } = productApi