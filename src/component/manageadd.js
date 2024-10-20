import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, ThemeProvider, createTheme,
  Drawer, List, ListItem, ListItemText, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios'; // Ensure axios is imported
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

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
    axios.delete(`/api/posts/${adId}`)
      .then(() => {
        setAds(ads.filter(ad => ad.id !== adId));
      })
      .catch(error => console.error('Error deleting ad:', error));
  };

  useEffect(() => {
    // Load ads data from the API
    // Here you can replace the sample data with the API call
    const sampleAds = [
      { id: 1, name: 'Ad 1', startDate: '2021-01-01', endDate: '2021-02-01', status: 'Active', imageUrl: 'https://via.placeholder.com/100' },
      { id: 2, name: 'Ad 2', startDate: '2021-03-01', endDate: '2021-04-01', status: 'Inactive', imageUrl: 'https://via.placeholder.com/100' },
      { id: 3, name: 'Ad 3', startDate: '2021-05-01', endDate: '2021-06-01', status: 'Active', imageUrl: 'https://via.placeholder.com/100' }
    ];
    
    setAds(sampleAds); // Set sample ads instead of fetching from the API
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAd(null);
  };

  const handleSave = () => {
    // Save logic for editing the post
    axios.put(`/api/posts/${currentAd.id}`, currentAd)
      .then(() => {
        setAds(ads.map(ad => (ad.id === currentAd.id ? currentAd : ad)));
        setOpenDialog(false);
      })
      .catch(error => console.error('Error updating ad:', error));
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manage Ads
          </Typography>
          <Button color="inherit" component={Link} to="/login">Logout</Button>
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
              <PeopleIcon />
              <ListItemText primary="Manage User" />
            </ListItem>
            <ListItem button component={Link} to="/managepost" sx={{ color: '#fff' }}>
              <AssignmentIcon />
              <ListItemText primary="Manage Post" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ pt: 10, pl: 3, pr: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
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
                    <img src={ad.imageUrl} alt={ad.title} style={{ width: '100px', height: 'auto', borderRadius: '5px' }} />
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Ad</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={currentAd?.title || ''}
              onChange={(e) => setCurrentAd({ ...currentAd, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Start Date"
              type="date"
              fullWidth
              variant="outlined"
              value={currentAd?.startDate || ''}
              onChange={(e) => setCurrentAd({ ...currentAd, startDate: e.target.value })}
            />
            <TextField
              margin="dense"
              label="End Date"
              type="date"
              fullWidth
              variant="outlined"
              value={currentAd?.endDate || ''}
              onChange={(e) => setCurrentAd({ ...currentAd, endDate: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={currentAd?.status || ''}
                onChange={(e) => setCurrentAd({ ...currentAd, status: e.target.value })}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ManageAds;
