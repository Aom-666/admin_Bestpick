import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Drawer, List, ListItem, ListItemText,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  ThemeProvider
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';

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

const ManageAds = () => {
  const [ads, setAds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const handleNavigateToAddAd = () => {
    navigate('/add');
  };

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (ad) => {
    setCurrentAd(ad);
    setOpenDialog(true);
  };

  const handleDelete = (adId) => {
    console.log('Deleting ad:', adId);
    // Assume delete operation here
  };

  useEffect(() => {
    // Load dummy data
    setAds([
      { id: 1, name: 'Ad 1', startDate: '2021-01-01', endDate: '2021-02-01', status: 'Active', imageUrl: 'https://via.placeholder.com/100' },
      { id: 2, name: 'Ad 2', startDate: '2021-03-01', endDate: '2021-04-01', status: 'Inactive', imageUrl: 'https://via.placeholder.com/100' }
    ]);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" onClick={handleMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Ads
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>Logout</Button>
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
              <DashboardIcon />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/manageuser" sx={{ color: '#fff' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage User" />
            </ListItem>
            <ListItem button component={Link} to="/managepost" sx={{ color: '#fff' }}>
              <AssignmentIcon sx={{ mr: 1}} />
              <ListItemText primary="Manage Post" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ pt: 10, pl: 3, pr: 3 }}>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          variant="contained"
          color="primary"
          onClick={handleNavigateToAddAd}
        >
          Add New Ad
        </Button>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell> {/* เพิ่มคอลัมน์สำหรับรูปภาพ */}
                <TableCell>Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <img src={ad.imageUrl} alt={ad.name} style={{ width: '100px', height: 'auto', borderRadius: '5px' }} /> {/* แสดงรูปภาพ */}
                  </TableCell>
                  <TableCell>{ad.name}</TableCell>
                  <TableCell>{ad.startDate}</TableCell>
                  <TableCell>{ad.endDate}</TableCell>
                  <TableCell>{ad.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(ad)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(ad.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default ManageAds;
