import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper, Grid, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard'; // นำเข้า DashboardIcon
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ลงทะเบียน `category` scale และส่วนประกอบอื่นๆ ที่ใช้ในกราฟ
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ตั้งค่าข้อมูลกราฟสำหรับผู้ใช้รายใหม่
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'New Users',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: '#3f51b5',
      borderColor: '#303f9f',
      borderWidth: 1,
    },
  ],
};

const totalUsersData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Total Users',
      data: [150, 200, 250, 300, 350, 400],
      backgroundColor: '#3f51b5',
      borderColor: '#303f9f',
      borderWidth: 1,
    },
  ],
};

// ตั้งค่าข้อมูลกราฟสำหรับยอดโพสต์รายวัน
const dailyPostsData = {
  labels: ['1', '2', '3', '4', '5', '6', '7'],
  datasets: [
    {
      label: 'Daily Posts',
      data: [10, 20, 15, 25, 30, 35, 40],
      backgroundColor: '#4caf50',
      borderColor: '#388e3c',
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State สำหรับเปิด/ปิด Sidebar

  const handleMenuClick = () => {
    setDrawerOpen(true); // เปิด Sidebar
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false); // ปิด Sidebar
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Taskbar ขยายเต็มความกว้าง */}
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', width: '100%', zIndex: 1200 }}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 20px' }}>
          <Box display="flex" alignItems="center">
            <MenuIcon sx={{ mr: 2, cursor: 'pointer' }} onClick={handleMenuClick} /> {/* เพิ่ม onClick ที่นี่ */}
            <Typography variant="h6" sx={{ color: '#ffffff' }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Box>
            <Button color="inherit" component={Link} to="/login">
              LOGOUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{ width: 250, backgroundColor: '#1976d2', color: '#fff', height: '100%' }} // ปรับสีพื้นหลัง
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>
            Menu
          </Typography>
          <List>
            <ListItem button component={Link} to="/dashboard" sx={{ color: '#fff' }}>
              <DashboardIcon sx={{ mr: 1 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/manageuser" sx={{ color: '#fff' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Users" />
            </ListItem>
            <ListItem button component={Link} to="/manageadd" sx={{ color: '#fff' }}>
              <AddCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Advertisement" />
            </ListItem>
            <ListItem button component={Link} to="/managepost" sx={{ color: '#fff' }}>
              <AssignmentIcon sx={{ mr: 1}} />
              <ListItemText primary="Manage Post" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* เนื้อหาหลักของ Dashboard */}
      <Container maxWidth="lg" sx={{ marginTop: '64px' }}>
        <Typography variant="h4" gutterBottom style={{ marginBottom: '20px' }}>
          Welcome, Admin!
        </Typography>
        <Grid container spacing={3}>
          {/* กราฟแสดงผู้ใช้รายใหม่ */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                New Users Overview
              </Typography>
              <Bar data={data} />
            </Paper>
          </Grid>

          {/* กราฟยอดผู้ใช้ทั้งหมด */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Total Users Overview
              </Typography>
              <Bar data={totalUsersData} />
            </Paper>
          </Grid>

          {/* กราฟยอดโพสต์รายวัน */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Daily Posts Overview
              </Typography>
              <Bar data={dailyPostsData} />
            </Paper>
          </Grid>


          {/* ข้อความแสดงผลเพิ่มเติม */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Admin Announcements
              </Typography>
              <Typography variant="body1">
                Keep track of the latest admin updates, changes, and user feedback here.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
