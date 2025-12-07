import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithAuth from './baseQuery'

// Define a service using a base URL and expected endpoints

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
    updateStatus: builder.mutation({
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
      }
    }),  
  }),
})

export const {useUpdateStatusMutation , useGetAllCustomOrdersQuery,
  useGetDetaildCustomOrderQuery,useGetProfileOrderQuery, } = customOrderApi