import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ThemeProvider,
  createTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

const ManagePosts = () => {
  const { handleLogout, isAdmin } = useAuth(); // เรียกใช้ handleLogout และ isAdmin จาก useAuth

  // ตรวจสอบว่าเป็นแอดมิน
  if (!isAdmin()) {
    return <div>Access Denied. You are not authorized to view this page.</div>; // แสดงข้อความถ้าไม่ใช่แอดมิน
  } 
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3000/admin/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
    setImageFiles(post.photo_url || []);
  };
  

  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/admin/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      if (selectedPost.id) {
        const response = await axios.put(`http://localhost:3000/admin/posts/${selectedPost.id}`, selectedPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(posts.map(post => (post.id === selectedPost.id ? selectedPost : post)));
      } else {
        const response = await axios.post('http://localhost:3000/admin/posts', selectedPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts([...posts, response.data]);
      }
      setOpenDialog(false);
    } catch (error) {
      if (error.response) {
        console.error('Error saving post:', error.response.data); // เพิ่มรายละเอียดของข้อผิดพลาดที่นี่
      } else {
        console.error('Error saving post:', error.message);
      }
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Manage Posts
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
            <ListItem button component={Link} to="/manageuser" sx={{ color: '#fff' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage User" />
            </ListItem>
            <ListItem button component={Link} to="/manageadd" sx={{ color: '#fff' }}>
              <AddCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Advertisement" />
            </ListItem>
            <ListItem button component={Link} to="/manage-reported-posts" sx={{ color: '#fff' }}>
              <ReportProblemIcon sx={{ mr: 1 }} />
              <ListItemText primary="Report posts" />
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
                <TableCell>Content</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {post.photo_url && post.photo_url.map((url, index) => (
                        <img key={index} src={`http://localhost:3000${url}`} alt={post.title} style={{ width: '80px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{post.Title}</TableCell>
                  <TableCell>{post.content}</TableCell>
                  <TableCell>{post.ProductName}</TableCell>
                  <TableCell>{post.status.toLowerCase()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(post)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(post.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedPost ? 'Edit Post' : 'Add Post'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedPost?.title || ''}
              onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Content"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedPost?.content || ''}
              onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Product Name"
              type="text"
              fullWidth
              variant="outlined"
              value={selectedPost?.ProductName || ''}
              onChange={(e) => setSelectedPost({ ...selectedPost, ProductName: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={selectedPost?.status || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value })}
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

export default ManagePosts;
