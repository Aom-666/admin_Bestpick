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
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link, useNavigate } from 'react-router-dom';

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
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Dummy data for demonstration
    setPosts([
      {
        id: 1,
        title: 'Post 1',
        startDate: '2024-10-01',
        endDate: '2024-10-10',
        status: 'Active',
        imageUrl: 'https://via.placeholder.com/100' // Placeholder image URL
      },
      {
        id: 2,
        title: 'Post 2',
        startDate: '2024-10-05',
        endDate: '2024-10-15',
        status: 'Inactive',
        imageUrl: 'https://via.placeholder.com/100' // Placeholder image URL
      }
    ]);
  }, []);

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleDelete = (postId) => {
    axios.delete(`/api/posts/${postId}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== postId));
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleSave = () => {
    axios.put(`/api/posts/${selectedPost.id}`, selectedPost)
      .then(() => {
        setPosts(posts.map(post => (post.id === selectedPost.id ? selectedPost : post)));
        setOpenDialog(false);
      })
      .catch(error => console.error('Error updating post:', error));
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
            <ListItem button component={Link} to="/manageadd" sx={{ color: '#fff' }}>
              <AddCircleIcon />
              <ListItemText primary="Manage Advertisement" />
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
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <img src={post.imageUrl} alt={post.title} style={{ width: '100px', borderRadius: '5px' }} />
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.status}</TableCell>
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
          <DialogTitle>Edit Post</DialogTitle>
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
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={selectedPost?.status || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value })}
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

export default ManagePosts;
