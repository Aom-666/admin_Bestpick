import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, ThemeProvider, createTheme,
  Drawer, List, ListItem, ListItemText, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useAuth } from '../AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
  typography: {
    fontFamily: 'Arial',
    h5: {
      fontWeight: 600,
    },
  },
});

const ManageUsers = () => {
  const { handleLogout, isAdmin } = useAuth(); // เรียกใช้ handleLogout และ isAdmin จาก useAuth

  // ตรวจสอบว่าเป็นแอดมิน
  if (!isAdmin()) {
    return <div>Access Denied. You are not authorized to view this page.</div>; // แสดงข้อความถ้าไม่ใช่แอดมิน
  }
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Only needed if sending form data
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };
  

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token'); // รับ token
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ใน headers
        },
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleMenuClick = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleSaveUser = async () => {
    const token = localStorage.getItem('token'); // รับ token
    try {
      if (selectedUser.id) {
        // Update user status
        await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/users/${selectedUser.id}/status`, {
          status: selectedUser.status,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ใน headers
          },
        });
        // Update users state
        setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, status: selectedUser.status } : user)));
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Users
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{ width: 250, backgroundColor: '#1976d2', color: '#fff', height: '100%' }}
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
            <ListItem button component={Link} to="/manageadd" sx={{ color: '#fff' }}>
              <AddCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Advertisements" />
            </ListItem>
            <ListItem button component={Link} to="/managepost" sx={{ color: '#fff' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Post" />
            </ListItem>
            <ListItem button component={Link} to="/manage-reported-posts" sx={{ color: '#fff' }}>
              <ReportProblemIcon sx={{ mr: 1 }} />
              <ListItemText primary="Report posts" />
            </ListItem>
            <ListItem button component={Link} to="/managecategories" sx={{ color: '#fff' }}>
              <CategoryIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Categories" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ p: 3, pt: 10 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Birthday</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{new Date(user.birthday).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEdit(user)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={selectedUser?.status || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="deactive">Deactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveUser}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageUsers;
