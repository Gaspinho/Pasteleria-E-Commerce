import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithAuth from './baseQuery'

// Define a service using a base URL and expected endpoints
export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAllOrder: builder.query({
      query: () => {
        return {
          url: 'user/getAllorder',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    updateOrder: builder.mutation({
      query:(order) => {
        console.log(order)
        const {id, ...rest} = order
        console.log(`rest: ${rest.order_Status}`)
        return {
          url: `user/update/${id}`,
          method: 'PUT',
          body: rest,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    detaildOrder: builder.query({
      query: (id) => {
        return {
          url: `user/getAllorder`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      },
      transformResponse: (response, meta, arg) => {
        // Filtrar para obtener solo la orden específica
        const order = response.find(o => o.id === arg);
        return order || null;
      }
    }),
    orderedProducts: builder.query({
      query: (id) => {
        return {
          url: `user/orderdProducts/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }}
    }),
    deleteOrder: builder.mutation({
      query:(order) => {
        return {
          url: `order/delete/${order}`,
          method: 'DELETE',
          body:order,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    updatePayment: builder.mutation({
      query:(order) => {
        console.log(order)
        const {id, ...rest} = order
        return {
          url: `order/paymentUpdate/${id}`,
          method: 'PUT',
          body: rest,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const { useGetAllOrderQuery, useUpdateOrderMutation ,useDeleteOrderMutation,
  useDetaildOrderQuery ,useOrderedProductsQuery ,useUpdatePaymentMutation} = orderApi