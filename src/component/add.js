import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, FormControlLabel, Checkbox } from '@mui/material';

const AddAd = () => {
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    targetURL: '',
    image: null,
    targetAudience: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdData({ ...adData, [name]: value });
  };

  const handleImageChange = (event) => {
    setAdData({ ...adData, image: event.target.files[0] });
  };

  const handleSubmit = () => {
    // Logic to submit ad data to server
    console.log(adData);
    alert('Ad Submitted Successfully!');
  };

  return (
    <Box component={Paper} p={3}>
      <Typography variant="h5">Add New Advertisement</Typography>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={adData.title}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        multiline
        rows={4}
        value={adData.description}
        onChange={handleInputChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Target URL"
        name="targetURL"
        value={adData.targetURL}
        onChange={handleInputChange}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Target Audience</InputLabel>
        <Select
          value={adData.targetAudience}
          label="Target Audience"
          onChange={handleInputChange}
          name="targetAudience"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="18-24">18-24</MenuItem>
          <MenuItem value="25-35">25-35</MenuItem>
          <MenuItem value="35+">35+</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        component="label"
        fullWidth
        margin="normal"
      >
        Upload Image
        <input
          type="file"
          hidden
          onChange={handleImageChange}
        />
      </Button>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Submit Advertisement
        </Button>
      </Box>
    </Box>
  );
};

export default AddAd;
