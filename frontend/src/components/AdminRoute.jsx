import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { userInfo } = useAuth();

  console.log("Security Guard Check:", userInfo);
  
  // If the user exists AND is an admin, let them through (Outlet).
  // Otherwise, kick them back to the login page.
  if (userInfo && userInfo.role === 'admin') {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default AdminRoute;