import { configureStore } from '@reduxjs/toolkit';
// Or from '@reduxjs/toolkit/query/react'
import { organizationApi } from './services/organization';
import { authApi } from 'services/auth';
import userReducer from 'services/userSlice';
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [organizationApi.reducerPath]: organizationApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    user: userReducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(organizationApi.middleware)
});
