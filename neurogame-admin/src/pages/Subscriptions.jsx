import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';
import PlanCard from '../components/PlanCard';
import PlanForm from '../components/PlanForm';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/subscriptions/plans');
      if (response.data.success) {
        setPlans(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError(err.response?.data?.message || 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (plan = null) => {
    setEditingPlan(plan);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (planData) => {
    try {
      if (editingPlan) {
        // Update existing plan
        const response = await api.put(`/subscriptions/plans/${editingPlan._id}`, planData);
        if (response.data.success) {
          setPlans(plans.map((p) => (p._id === editingPlan._id ? response.data.data : p)));
          showSnackbar('Subscription plan updated successfully', 'success');
        }
      } else {
        // Create new plan
        const response = await api.post('/subscriptions/plans', planData);
        if (response.data.success) {
          setPlans([...plans, response.data.data]);
          showSnackbar('Subscription plan created successfully', 'success');
        }
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error saving subscription plan:', err);
      showSnackbar(err.response?.data?.message || 'Failed to save subscription plan', 'error');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }

    try {
      const response = await api.delete(`/subscriptions/plans/${planId}`);
      if (response.data.success) {
        setPlans(plans.filter((p) => p._id !== planId));
        showSnackbar('Subscription plan deleted successfully', 'success');
      }
    } catch (err) {
      console.error('Error deleting subscription plan:', err);
      showSnackbar(err.response?.data?.message || 'Failed to delete subscription plan', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Subscription Plans
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage subscription plans and pricing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          size="large"
        >
          Add Plan
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : plans.length === 0 ? (
        <Alert severity="info">
          No subscription plans available. Create your first plan!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan._id}>
              <PlanCard
                plan={plan}
                onEdit={() => handleOpenForm(plan)}
                onDelete={() => handleDeletePlan(plan._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <PlanForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSavePlan}
        plan={editingPlan}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Subscriptions;
