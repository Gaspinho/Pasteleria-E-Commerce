import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
const baseQueryWithAuth = fetchBaseQuery({ 
  baseUrl: 'http://127.0.0.1:8000/',
  prepareHeaders: (headers) => {
    // Obtener el token de sessionStorage
    const token = sessionStorage.getItem('access_token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})
const baseQueryTransbank = fetchBaseQuery({ 
  baseUrl: 'http://127.0.0.1:8000/webpay/',
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem('access_token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const transbankApi = createApi({
  reducerPath: 'transbankApi',
  baseQuery: baseQueryTransbank,
  endpoints: (builder) => ({
    initTransaction: builder.mutation({
      query: (transactionData) => {
        // Crear FormData
        const formData = new URLSearchParams();
        formData.append('amount', transactionData.amount);
        formData.append('session_id', transactionData.session_id);
        formData.append('buy_order', transactionData.buy_order);
        
        return {
          url: 'init',
          method: 'POST',
          body: formData,
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
          responseHandler: (response) => response.text(), // Aceptar HTML
        };
      },
    }),
    confirmTransaction: builder.mutation({
      query: (token_ws) => ({
        url: `return?token_ws=${token_ws}`,
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        }
      }),
    }),
  }),
});

export const customOrderApi = createApi({
  reducerPath: 'customOrderApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAllCustomOrders: builder.query({
      query: () => {
        return {
          url: 'customizeorder/getAllCustomizeOrder/',
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getUserCustomOrder: builder.query({
      query: (id) => {
        return {
          url: `customizeorder/getUserCustomizeOrder/${id}`,
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getDetaildCustomOrder: builder.query({
      query: (id) => {
        return {
          url: `customizeorder/getDetaildCustomOrder/${id}`,
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    placeCustomOrder: builder.mutation({
      query: (data) => {
        return {
          url: `customizeorder/placeCustomOrder/`,
          method: 'POST',
          body: data,
          headers: {
            'Content-type': 'application/json',
          }
      }}
    }),   
    updateOrder: builder.mutation({
      query: (data) => {
        const {id, ...rest} = data
        return {
          url: `customizeorder/updateStatus/${id}`,
          method: 'PUT',
          body: rest,
          headers: {
            'Content-type': 'application/json',
        }
      }}
    }),
    getProfileOrder: builder.query({
      query: (id) => {
        return {
          url: `customizeorder/getProfileOrder/${id}`,
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      transformResponse: (response) => {
        // El backend devuelve {orders: [...]}
        // Extraemos el array directamente
        return response?.orders || [];
      }
    }),     
  }),
})

export const {useUpdateOrderMutation , useGetProfileOrderQuery, usePlaceCustomOrderMutation ,useGetDetaildCustomOrderQuery,
   useGetAllCustomOrdersQuery, useGetUserCustomOrderQuery} = customOrderApi
export const { useInitTransactionMutation, useConfirmTransactionMutation} = transbankApi