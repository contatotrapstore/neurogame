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
      setError(err.response?.data?.message || err.message || 'Falha ao carregar planos de assinatura');
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
        showSnackbar('Plano de assinatura atualizado com sucesso', 'success');
      } else {
        const newPlan = await subscriptionsAPI.createPlan(planData);
        setPlans((prev) => [...prev, newPlan]);
        showSnackbar('Plano de assinatura criado com sucesso', 'success');
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error saving subscription plan:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Falha ao salvar plano de assinatura', 'error');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano de assinatura?')) {
      return;
    }

    try {
      await subscriptionsAPI.deletePlan(planId);
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      showSnackbar('Plano de assinatura excluído com sucesso', 'success');
    } catch (err) {
      console.error('Error deleting subscription plan:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Falha ao excluir plano de assinatura', 'error');
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
            Planos de Assinatura
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie planos de assinatura e preços
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          size="large"
        >
          Adicionar Plano
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
          Nenhum plano de assinatura disponível. Crie seu primeiro plano!
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
