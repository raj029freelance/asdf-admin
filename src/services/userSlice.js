import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  isAuthenticated: false
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    getUsersSuccess: (state, action) => {
      state.user = { ...action.payload };
      state.isAuthenticated = true;
    },
    getUsersFail: (state) => {
      state.users = {};
      state.isAuthenticated = false;
    }
  }
});

export const { getUsersFail, getUsersSuccess } = userSlice.actions;
export default userSlice.reducer;
