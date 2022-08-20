import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const organizationApi = createApi({
  reducerPath: 'organizationApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_BACKEND_URL}/organizations` }),
  tagTypes: ['Organizations', 'Queries'],
  endpoints: (builder) => ({
    addOrganizations: builder.mutation({
      query: (organizations) => ({
        url: '/all',
        method: 'post',
        body: organizations
      }),
      invalidatesTags: ['Organizations']
    }),
    addOrganization: builder.mutation({
      query: (organization) => ({
        url: '/',
        method: 'post',
        body: organization
      })
    }),
    editOrganization: builder.mutation({
      query: ({ _id, data }) => ({
        url: `/${_id}`,
        method: 'post',
        body: data,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }),
      invalidatesTags: ['Organizations']
    }),
    deleteOrganization: builder.mutation({
      query: ({ _id }) => ({
        url: `/${_id}`,
        method: 'delete'
      }),
      invalidatesTags: ['Organizations']
    }),
    getPaginatedOrganizations: builder.query({
      query: ({ page, limit }) => ({
        url: '/paginated/all',
        method: 'get',
        params: { page, limit }
      }),
      providesTags: ['Organizations']
    }),
    getUserQueries: builder.query({
      query: () => ({
        url: '/query',
        method: 'get'
      }),
      providesTags: ['Queries']
    }),
    deleteUser: builder.mutation({
      query: ({ _id }) => ({
        url: `/query/${_id}`,
        method: 'delete'
      }),
      invalidatesTags: ['Queries']
    })
  })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddOrganizationsMutation,
  useGetPaginatedOrganizationsQuery,
  useDeleteOrganizationMutation,
  useAddOrganizationMutation,
  useGetUserQueriesQuery,
  useEditOrganizationMutation,
  useDeleteUserMutation
} = organizationApi;
