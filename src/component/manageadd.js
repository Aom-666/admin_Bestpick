import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, ThemeProvider, createTheme,
  Drawer, List, ListItem, ListItemText, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../AuthContext'; // นำเข้า useAuth

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
  const { handleLogout, isAdmin } = useAuth(); // เรียกใช้ handleLogout และ isAdmin จาก useAuth

  // ตรวจสอบว่าเป็นแอดมิน
  if (!isAdmin()) {
    return <div>Access Denied. You are not authorized to view this page.</div>; // แสดงข้อความถ้าไม่ใช่แอดมิน
  }

  const [ads, setAds] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAd, setCurrentAd] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (ad) => {
    setCurrentAd(ad);
    setOpenDialog(true);
    setImageFile(null);
  };

  const handleDelete = async (adId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/ads/${adId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(ads.filter(ad => ad.id !== adId));
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const fetchAds = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAds(response.data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentAd(null);
    setImageFile(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token'); // รับ token
    const formData = new FormData();
    formData.append('title', currentAd.title);
    formData.append('content', currentAd.content);
    formData.append('link', currentAd.link);
    formData.append('status', currentAd.status); // เพิ่มสถานะที่แก้ไข

    // แปลงค่าของ created_at, updated_at และ expiration_date ให้อยู่ในรูปแบบที่ MySQL คาดหวัง
    if (currentAd.created_at) {
      formData.append('created_at', new Date(currentAd.created_at).toISOString().slice(0, 19).replace('T', ' '));
    }
    if (currentAd.updated_at) {
      formData.append('updated_at', new Date(currentAd.updated_at).toISOString().slice(0, 19).replace('T', ' '));
    }
    if (currentAd.expiration_date) {
      formData.append('expiration_date', new Date(currentAd.expiration_date).toISOString().slice(0, 19).replace('T', ' '));
    }

    // ถ้าผู้ใช้ไม่ได้เลือกไฟล์ใหม่ ให้ใช้ภาพเดิม
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (currentAd.image) {
      // ส่ง URL ของภาพเดิมหรือรูปภาพใหม่ที่อยู่ในฐานข้อมูล
      formData.append('image', currentAd.image);
    }

    console.log('FormData to be sent:', formData); // ตรวจสอบข้อมูลที่ส่งไปยังเซิร์ฟเวอร์

    try {
      if (currentAd.id) {
        // Update Ad
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/ads/${currentAd.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Ad updated successfully:', response.data);
        setAds(ads.map(ad => (ad.id === currentAd.id ? { ...ad, ...currentAd } : ad)));
      } else {
        // Create new Ad
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/ads`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Ad created successfully:', response.data);
        setAds([...ads, response.data]);
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.response) {
        console.error('Error saving ad:', error.response.data);
      } else {
        console.error('Error saving ad:', error.message);
      }
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
            Manage Ads
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button> {/* ปุ่มล็อกเอาท์ */}
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
            <ListItem button component={Link} to="/manageuser" sx={{ color: '#fff' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage User" />
            </ListItem>
            <ListItem button component={Link} to="/managepost" sx={{ color: '#fff' }}>
              <AssignmentIcon sx={{ mr: 1 }} />
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

      <Box sx={{ pt: 10, pl: 3, pr: 3 }}>
        <Button variant="contained" color="primary" component={Link} to="/add" sx={{ mb: 2 }}>
          Add New Ad
        </Button> {/* ปุ่มเพื่อไปยังหน้าเพิ่มโฆษณา */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Expiration Date</TableCell>
                <TableCell>Status</TableCell> {/* เพิ่มคอลัมน์สถานะ */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}${ad.image}`}
                      alt={ad.title}
                      style={{ width: '100px', height: 'auto', borderRadius: '5px' }}
                    />
                  </TableCell>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.content}</TableCell>
                  <TableCell>
                    <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a>
                  </TableCell>
                  <TableCell>{new Date(ad.created_at).toLocaleString('en-GB')}</TableCell>
                  <TableCell>{new Date(ad.updated_at).toLocaleString('en-GB')}</TableCell>
                  <TableCell>
                    {ad.expiration_date ? new Date(ad.expiration_date).toLocaleString('en-GB') : 'N/A'}
                  </TableCell>
                  <TableCell>{ad.status.toLowerCase()}</TableCell>
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
          <DialogTitle>{currentAd ? 'Edit Ad' : 'Add Ad'}</DialogTitle>
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
              label="Content"
              type="text"
              fullWidth
              variant="outlined"
              value={currentAd?.content || ''}
              onChange={(e) => setCurrentAd({ ...currentAd, content: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Link"
              type="text"
              fullWidth
              variant="outlined"
              value={currentAd?.link || ''}
              onChange={(e) => setCurrentAd({ ...currentAd, link: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Image"
              type="file"
              fullWidth
              variant="outlined"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            {/* แสดงตัวอย่างรูปภาพถ้ามี */}
            {currentAd && currentAd.image && (
              <img
                src={`${process.env.REACT_APP_BASE_URL}${currentAd.image}`} // ใช้ URL ของภาพที่จัดเก็บไว้ใน currentAd
                alt="Ad Preview"
                style={{ width: '100%', height: 'auto', borderRadius: '5px', marginTop: '10px' }}
              />
            )}

            {/* ฟิลด์อื่น ๆ */}
            <TextField
              margin="dense"
              label="Created At"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={currentAd?.created_at ? new Date(currentAd.created_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => setCurrentAd({ ...currentAd, created_at: new Date(e.target.value).toISOString() })}
            />
            <TextField
              margin="dense"
              label="Updated At"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={currentAd?.updated_at ? new Date(currentAd.updated_at).toISOString().slice(0, 16) : ''}
              onChange={(e) => setCurrentAd({ ...currentAd, updated_at: new Date(e.target.value).toISOString() })}
            />
            <TextField
              margin="dense"
              label="Expiration Date"
              type="date"
              fullWidth
              variant="outlined"
              value={currentAd?.expiration_date ? new Date(currentAd.expiration_date).toISOString().slice(0, 10) : ''}
              onChange={(e) => setCurrentAd({ ...currentAd, expiration_date: new Date(e.target.value).toISOString() })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={currentAd?.status || ''}
                onChange={(e) => setCurrentAd({ ...currentAd, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
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
