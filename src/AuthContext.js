import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // นำเข้าด้วยชื่อที่ถูกต้อง

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // ถอดรหัส JWT
        // ตรวจสอบว่า decoded มีข้อมูล admin หรือไม่ (ปรับให้เหมาะสมกับโครงสร้างของ JWT ของคุณ)
        return decoded.role === 'admin'; // สมมติว่ามีฟิลด์ role ใน JWT
      } catch (error) {
        console.error('Token decode error:', error);
        return false;
      }
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ handleLogout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
