import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { isAdmin } = useAuth(); // ดึงค่าจาก AuthContext

  return (
    <Route
      {...rest}
      element={isAdmin ? element : <Navigate to="/" />} // ถ้าไม่ใช่แอดมินให้ redirect ไปหน้าอื่น
    />
  );
};

export default PrivateRoute;
