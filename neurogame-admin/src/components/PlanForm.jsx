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
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const PlanForm = ({ open, onClose, onSave, plan }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: [],
    isActive: true,
    featured: false,
  });

  const [featureInput, setFeatureInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || '',
        billingCycle: plan.billingCycle || 'monthly',
        features: plan.features || [],
        isActive: plan.isActive !== undefined ? plan.isActive : true,
        featured: plan.featured || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        billingCycle: 'monthly',
        features: [],
        isActive: true,
        featured: false,
      });
    }
    setErrors({});
    setFeatureInput('');
  }, [plan, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isActive' || name === 'featured' ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleFeatureKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.billingCycle) {
      newErrors.billingCycle = 'Billing cycle is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{plan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plan Name"
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
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={Boolean(errors.price)}
              helperText={errors.price}
              required
              InputProps={{
                startAdornment: <Box sx={{ mr: 1 }}>$</Box>,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.billingCycle)} required>
              <InputLabel>Billing Cycle</InputLabel>
              <Select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                label="Billing Cycle"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <TextField
                fullWidth
                label="Add Feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={handleFeatureKeyPress}
                placeholder="Type a feature and press Enter or click Add"
                InputProps={{
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={handleAddFeature}
                      disabled={!featureInput.trim()}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {formData.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    onDelete={() => handleRemoveFeature(index)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Box>
            </Box>
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

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.featured}
                  onChange={handleChange}
                  name="featured"
                />
              }
              label="Featured Plan"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {plan ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanForm;
