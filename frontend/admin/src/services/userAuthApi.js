import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithAuth from './baseQuery'

// Define a service using a base URL and expected endpoints
export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: 'user/register',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: 'user/login',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    registerStaff: builder.mutation({
      query: (user) => {
        return {
          url: 'user/register',
          method: 'POST',
          body: { ...user, admin: 'true' },
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const { useRegisterUserMutation, useLoginUserMutation , useRegisterStaffMutation} = userAuthApi