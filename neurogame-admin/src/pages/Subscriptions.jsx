import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { subscriptionsAPI, gamesAPI } from '../services/api';
import PlanCard from '../components/PlanCard';
import PlanForm from '../components/PlanForm';

const Subscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [availableGames, setAvailableGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPlans();
    fetchGames();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError('');

    try {
      const { plans: fetchedPlans } = await subscriptionsAPI.getAllPlans();
      setPlans(fetchedPlans);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const { games } = await gamesAPI.getAll({ isActive: true });
      setAvailableGames(games);
    } catch (err) {
      console.error('Error fetching games for plans:', err);
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
        const updatedPlan = await subscriptionsAPI.updatePlan(editingPlan.id, planData);
        setPlans((prev) => prev.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan)));
        showSnackbar('Subscription plan updated successfully', 'success');
      } else {
        const newPlan = await subscriptionsAPI.createPlan(planData);
        setPlans((prev) => [...prev, newPlan]);
        showSnackbar('Subscription plan created successfully', 'success');
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error saving subscription plan:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Failed to save subscription plan', 'error');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }

    try {
      await subscriptionsAPI.deletePlan(planId);
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      showSnackbar('Subscription plan deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting subscription plan:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Failed to delete subscription plan', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <PlanCard
                plan={plan}
                onEdit={() => handleOpenForm(plan)}
                onDelete={() => handleDeletePlan(plan.id)}
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
        availableGames={availableGames}
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
