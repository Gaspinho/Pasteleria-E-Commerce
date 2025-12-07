import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithAuth from './baseQuery'

// Define a service using a base URL and expected endpoints
export const userCRUDApi = createApi({
  reducerPath: 'userCRUDApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({ 
    getAllCustomers: builder.query({
      query: () => {
        return {
          url: 'user/getAllcustomers',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getAllStaff: builder.query({
      query: () => {
        return {
          url: 'user/getAllstaff',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getUser: builder.query({
      query: (id) => {
        return {
          url: `user/Uprofile/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getLoggedUser: builder.query({
      query: () => {
        return {
          url: 'user/get_user',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    updateUser: builder.mutation({
      query:(user) => {
        const {id, ...rest} = user
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
    deleteUser: builder.mutation({
      query:(id) => {
        return {
          url: `user/delete/${id}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const { useGetAllCustomersQuery, useGetAllStaffQuery , 
  useGetLoggedUserQuery, useGetUserQuery ,useUpdateUserMutation,useDeleteUserMutation } = userCRUDApi