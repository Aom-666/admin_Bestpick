import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Paper, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'; // นำเข้า axios

// สร้างธีมที่กำหนดเอง
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // สีหลัก
    },
    secondary: {
      main: '#03dac6', // สีรอง
    },
  },
});

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // ส่งคำขอไปยัง API เพื่อทำการล็อกอิน
      const response = await axios.post('http://localhost:4000/api/login', {
        username,
        password,
      });

      // หากล็อกอินสำเร็จ จะได้รับ token
      const { token } = response.data;
      localStorage.setItem('token', token); // เก็บ token ใน localStorage

      // นำทางไปยังหน้า Dashboard
      navigate('/dashboard');
    } catch (error) {
      alert('เข้าสู่ระบบล้มเหลว'); // แจ้งเตือนเมื่อข้อมูลไม่ถูกต้อง
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs" style={{ marginTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} style={{ padding: '40px', borderRadius: '20px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
          <Typography variant="h4" align="center" gutterBottom style={{ color: '#6200ea', fontWeight: 'bold' }}>
            Admin Login
          </Typography>
          <Box mb={2}>
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ borderRadius: '10px', backgroundColor: '#f5f5f5' }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: '10px', backgroundColor: '#f5f5f5' }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            style={{
              padding: '15px 0',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              marginTop: '20px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3700b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6200ea'}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
