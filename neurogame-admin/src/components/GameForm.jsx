import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';

const GameForm = ({ open, onClose, onSave, game }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: '',
    version: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        description: game.description || '',
        category: game.category || '',
        difficulty: game.difficulty || '',
        version: game.version || '',
        isActive: game.isActive !== undefined ? game.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        difficulty: '',
        version: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [game, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Game name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{game ? 'Edit Game' : 'Create New Game'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Game Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={Boolean(errors.category)}
              helperText={errors.category}
              required
              placeholder="e.g., Memory, Attention, Logic"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.difficulty)} required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                label="Difficulty"
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              placeholder="e.g., 1.0.0"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Active"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {game ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameForm;
