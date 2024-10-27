import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, TextField,
  ThemeProvider, createTheme, FormControl, InputLabel,
  Select, MenuItem
} from '@mui/material';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
});

const AddAd = () => {
  const [adData, setAdData] = useState({
    title: '',
    content: '',
    link: '',
    image: null,
    created_at: '',
    updated_at: '',
    expiration_date: '',
    status: 'active',
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData({
      ...adData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setAdData({
      ...adData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(adData).forEach(key => {
      formData.append(key, adData[key]);
    });

    const token = localStorage.getItem('token'); // รับ token

    try {
      const response = await axios.post('${process.env.REACT_APP_BASE_URL}/ads', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Ad created successfully:', response.data);
      navigate('/manageadd'); // กลับไปที่หน้าจัดการโฆษณา
    } catch (error) {
      console.error('Error creating ad:', error.response?.data || error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add New Ad
          </Typography>
          <Button color="inherit" component={Link} to="/manageadd">Back</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 10, pl: 3, pr: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            name="title"
            value={adData.title}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Content"
            name="content"
            value={adData.content}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Link"
            name="link"
            value={adData.link}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Image"
            type="file"
            onChange={handleFileChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Created At"
            type="datetime-local"
            name="created_at"
            value={adData.created_at}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Updated At"
            type="datetime-local"
            name="updated_at"
            value={adData.updated_at}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Expiration Date"
            type="date"
            name="expiration_date"
            value={adData.expiration_date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={adData.status}
              onChange={handleChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Add Ad
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default AddAd;
