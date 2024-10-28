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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  createTheme,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
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

const ManageReportedPosts = () => {
  const { handleLogout, isAdmin } = useAuth();

  if (!isAdmin()) {
    return <div>Access Denied. You are not authorized to view this page.</div>;
  }

  const [reportedPosts, setReportedPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  const fetchReportedPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/reported-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReportedPosts(response.data);
    } catch (error) {
      console.error('Error fetching reported posts:', error);
    }
  };

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleEdit = (report) => {
    setSelectedPost(report);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/admin/reports/${selectedPost.report_id}`, {
        status: selectedPost.status
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReportedPosts(reportedPosts.map(report => 
        report.report_id === selectedPost.report_id ? { ...report, status: selectedPost.status } : report
      ));
      setOpenDialog(false);
    } catch (error) {
      if (error.response) {
        console.error('Error updating report status:', error.response.data);
      } else {
        console.error('Error updating report status:', error.message);
      }
    }
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
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

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
            <ListItem button component={Link} to="/manageadd" sx={{ color: '#fff' }}>
              <AddCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Advertisement" />
            </ListItem>
            <ListItem button component={Link} to="/managecategories" sx={{ color: '#fff' }}>
              <CategoryIcon sx={{ mr: 1 }} />
              <ListItemText primary="Manage Categories" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ pt: 10, pl: 3, pr: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Post Title</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Reported At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportedPosts.map((report) => (
                <TableRow key={report.report_id}>
                  <TableCell>{report.post_title}</TableCell>
                  <TableCell>{report.reported_by_username}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell>{new Date(report.reported_at).toLocaleDateString('th-TH')} {new Date(report.reported_at).toLocaleTimeString('th-TH')}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(report)} color="primary">
                      <EditIcon />
                    </IconButton>                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Report Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={selectedPost?.status || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, status: e.target.value })}
              >
                <MenuItem value="block">Block</MenuItem>
                <MenuItem value="normally">Normally</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageReportedPosts;
