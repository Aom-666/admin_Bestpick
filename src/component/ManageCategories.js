import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
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
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const ManageCategories = () => {
    const { handleLogout, isAdmin } = useAuth();
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        fetchCategories(); // ดึงข้อมูล categories เมื่อคอมโพเนนต์โหลด
    }, []);

    const fetchCategories = async () => {
        const token = localStorage.getItem('token'); // รับ token จาก localStorage
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`, // ส่ง token เป็น header
                },
            });
            setCategories(response.data); // ตั้งค่า categories
        } catch (error) {
            console.error('Error fetching categories:', error); // แสดงข้อผิดพลาดถ้ามี
        }
    };

    const handleMenuClick = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleOpenDialog = (category = null) => {
        setSelectedCategory(category);
        setCategoryName(category ? category.CategoryName : '');
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCategory(null);
        setCategoryName('');
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        try {
            if (selectedCategory) {
                // Update Category
                await axios.put(`${process.env.REACT_APP_BASE_URL}/categories/${selectedCategory.CategoryID}`, {
                    CategoryName: categoryName,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(categories.map(cat => (cat.CategoryID === selectedCategory.CategoryID ? { ...cat, CategoryName: categoryName } : cat)));
            } else {
                // Create Category
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/categories`, {
                    CategoryName: categoryName,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories([...categories, { CategoryID: response.data.categoryId, CategoryName: categoryName }]);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (categoryId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(categories.filter(cat => cat.CategoryID !== categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', width: '100%', zIndex: 1200 }}>
                <Toolbar sx={{ justifyContent: 'space-between', padding: '0 20px' }}>
                    <Box display="flex" alignItems="center">
                        <MenuIcon sx={{ mr: 2, cursor: 'pointer' }} onClick={handleMenuClick} />
                        <Typography variant="h6" sx={{ color: '#ffffff' }}>Manage Categories</Typography>
                    </Box>
                    <Box>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
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
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
                    Add New Category
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Category ID</TableCell>
                                <TableCell>Category Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.CategoryID}>
                                    <TableCell>{category.CategoryID}</TableCell>
                                    <TableCell>{category.CategoryName}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(category)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(category.CategoryID)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Category Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
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

export default ManageCategories;
