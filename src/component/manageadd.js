import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Drawer, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// กำหนดธีมสี
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#fff',
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

  // Dummy data loading effect
  useEffect(() => {
    setAds([
      { id: 1, name: 'Ad 1', startDate: '2021-01-01', endDate: '2021-02-01', status: 'Active' },
      { id: 2, name: 'Ad 2', startDate: '2021-03-01', endDate: '2021-04-01', status: 'Inactive' }
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
              <DashboardIcon />
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/manageuser" sx={{ color: '#fff' }}>
              <AddCircleIcon />
              <ListItemText primary="Manage User" />
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
