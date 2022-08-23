import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BACKEND_URL}/user`,
    prepareHeaders: (headers) => {
      headers.append("Content-Type", "application/json");
      headers.append("token", localStorage.getItem("token"));
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "post",
        body: payload,
      }),
    }),
    signUp: builder.mutation({
      query: (payload) => ({
        url: "/signup",
        method: "post",
        body: payload,
      }),
    }),
    verifyMe: builder.query({
      query: () => ({
        url: "/me",
        method: "get",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation, useSignUpMutation, useVerifyMeQuery } =
  authApi;
