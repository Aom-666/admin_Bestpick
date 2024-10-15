import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper } from '@mui/material';

const Logout = () => {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับ Logout
  useEffect(() => {
    // ลบข้อมูลจาก Local Storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');

    // แสดงข้อความยืนยันการ Logout
    setTimeout(() => {
      // นำทางกลับไปยังหน้า Login หลังจาก 1 วินาที
      navigate('/signin');
    }, 1000);
  }, [navigate]);

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '30px', borderRadius: '15px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#f44336', fontWeight: 'bold' }}>
          Logging out...
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '20px', color: '#7f8c8d' }}>
          You are being logged out. Please wait a moment.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/signin')}
          style={{ fontWeight: 'bold', letterSpacing: '1px' }}
        >
          Go to Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Logout;
