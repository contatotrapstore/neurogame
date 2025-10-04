import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  SportsEsports as GamesIcon,
  CardMembership as SubscriptionIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { usersAPI, gamesAPI } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card elevation={2} sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="h3" component="div" fontWeight="bold">
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.lighter`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ fontSize: 32, color: `${color}.main` }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGames: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');

    try {
      const [usersRes, gamesRes] = await Promise.all([
        usersAPI.getAll({ limit: 1 }),
        gamesAPI.getAll({ limit: 1 })
      ]);

      setStats({
        totalUsers: usersRes.pagination.total,
        totalGames: gamesRes.count
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || err.message || 'Falha ao carregar estatísticas do painel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Painel de Controle
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Bem-vindo ao Painel Administrativo do NeuroGame
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Total de Usuários"
            value={stats.totalUsers}
            icon={PeopleIcon}
            color="primary"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <StatCard
            title="Total de Jogos"
            value={stats.totalGames}
            icon={GamesIcon}
            color="success"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Atividade Recente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nenhuma atividade recente para exibir
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Ações Rápidas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use a barra lateral para gerenciar jogos e usuários
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
