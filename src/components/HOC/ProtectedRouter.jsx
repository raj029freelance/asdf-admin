import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRouter;
