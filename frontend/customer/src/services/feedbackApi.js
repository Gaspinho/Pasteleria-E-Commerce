import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
// Updated to use FastAPI + Supabase backend

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  endpoints: (builder) => ({
    getAllReview: builder.query({
      query: () => {
        return {
          url: 'feedback/reviews',
          method: 'GET', 
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getProductReviews: builder.query({
      query: (productId) => {
        return {
          url: `feedback/products/${productId}/reviews`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getProductRatingSummary: builder.query({
      query: (productId) => {
        return {
          url: `feedback/products/${productId}/rating-summary`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getAllQuestion: builder.query({
      query: () => {
        return {
          url: `feedback/questions`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    postReview: builder.mutation({
      query: (review) => {
        return {
          url: `feedback/reviews`,
          method: 'POST',
          body: review,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    postQusetion: builder.mutation({
      query: (question) => {
        return {
          url: `feedback/questions`,
          method: 'POST',
          body: question,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    deleteReview: builder.mutation({
      query: (id) => {
        return {
          url: `feedback/reviews/${id}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    deleteQuestion: builder.mutation({
      query: (id) => {
        return {
          url: `feedback/questions/${id}`,
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
  }),
})

export const {
  useDeleteReviewMutation, 
  useGetAllReviewQuery, 
  useGetProductReviewsQuery,
  useGetProductRatingSummaryQuery,
  usePostReviewMutation,
  usePostQusetionMutation,
  useGetAllQuestionQuery,
  useDeleteQuestionMutation
} = feedbackApi