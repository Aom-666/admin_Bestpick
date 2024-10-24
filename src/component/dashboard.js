import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false); // Sidebar state
  const [newUsersData, setNewUsersData] = useState([]);
  const [totalPostsData, setTotalPostsData] = useState([]);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Token sent in the headers
        });
        setNewUsersData(response.data.new_users_per_day);
        setTotalPostsData(response.data.total_posts_per_day);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchData();
  }, []);

  const handleMenuClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Prepare data for charts (mapping API data into chart.js format)
  const newUserChartData = {
    labels: newUsersData.map(data => data.date), // Map dates for x-axis
    datasets: [
      {
        label: 'New Users',
        data: newUsersData.map(data => data.new_users),
        backgroundColor: '#3f51b5',
        borderColor: '#303f9f',
        borderWidth: 1,
      },
    ],
  };

  const totalPostChartData = {
    labels: totalPostsData.map(data => data.date), // Map dates for x-axis
    datasets: [
      {
        label: 'Total Posts',
        data: totalPostsData.map(data => data.total_posts),
        backgroundColor: '#ff9800',
        borderColor: '#f57c00',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', width: '100%', zIndex: 1200 }}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 20px' }}>
          <Box display="flex" alignItems="center">
            <MenuIcon sx={{ mr: 2, cursor: 'pointer' }} onClick={handleMenuClick} />
            <Typography variant="h6" sx={{ color: '#ffffff' }}>Admin Dashboard</Typography>
          </Box>
          <Box>
            <Button color="inherit" component={Link} to="/login">LOGOUT</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 250, backgroundColor: '#1976d2', color: '#fff', height: '100%' }} role="presentation" onClick={handleDrawerClose} onKeyDown={handleDrawerClose}>
          <Typography variant="h6" sx={{ padding: '16px', textAlign: 'center', fontWeight: 'bold' }}>Menu</Typography>
          <List>
            <ListItem button component={Link} to="/dashboard" sx={{ color: '#fff' }}>
              <DashboardIcon sx={{ mr: 1 }} />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/manageuser" sx={{ color: '#fff' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Users" />
            </ListItem>
            <ListItem button component={Link} to="/managepost" sx={{ color: '#fff' }}>
              <AssignmentIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Post" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Dashboard content */}
      <Container maxWidth="lg" sx={{ marginTop: '64px' }}>
        <Typography variant="h4" gutterBottom>Welcome, Admin!</Typography>
        <Grid container spacing={3}>
          {/* New Users Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>New Users Overview</Typography>
              <Bar data={newUserChartData} />
            </Paper>
          </Grid>

          {/* Total Posts Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>Total Posts Overview</Typography>
              <Bar data={totalPostChartData} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
