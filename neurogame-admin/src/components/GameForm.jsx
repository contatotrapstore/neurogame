import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';

const defaultState = {
  name: '',
  slug: '',
  description: '',
  category: '',
  folderPath: '',
  coverImage: '',
  order: 0,
  isActive: true
};

const GameForm = ({ open, onClose, onSave, game }) => {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        slug: game.slug || '',
        description: game.description || '',
        category: game.category || '',
        folderPath: game.folderPath || '',
        coverImage: game.coverImage || '',
        order: game.order ?? 0,
        isActive: game.isActive ?? true
      });
    } else {
      setFormData(defaultState);
    }
    setErrors({});
  }, [game, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Game name is required';
    }

    if (!formData.slug.trim()) {
      nextErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      nextErrors.slug = 'Use only lowercase letters, numbers, and hyphens';
    }

    if (!formData.folderPath.trim()) {
      nextErrors.folderPath = 'Folder path is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      folderPath: formData.folderPath.trim(),
      coverImage: formData.coverImage.trim(),
      order: Number(formData.order) || 0,
      isActive: formData.isActive
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{game ? 'Edit Game' : 'Create New Game'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Game name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              error={Boolean(errors.slug)}
              helperText={errors.slug || 'Lowercase letters, numbers, hyphen'}
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
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Folder path"
              name="folderPath"
              value={formData.folderPath}
              onChange={handleChange}
              error={Boolean(errors.folderPath)}
              helperText={errors.folderPath || 'Ex: Jogos/autorama'}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cover image URL"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
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
