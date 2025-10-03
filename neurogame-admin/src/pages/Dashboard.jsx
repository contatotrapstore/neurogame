import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  SportsEsports as GamesIcon,
  CardMembership as SubscriptionIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import api from '../services/api';

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
            justifyContent: 'center',
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
    totalGames: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
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
      const [usersRes, gamesRes, subscriptionsRes] = await Promise.all([
        api.get('/users'),
        api.get('/games'),
        api.get('/subscriptions/plans'),
      ]);

      // Calculate stats
      const totalUsers = usersRes.data.data?.length || 0;
      const totalGames = gamesRes.data.data?.length || 0;
      const totalSubscriptions = subscriptionsRes.data.data?.length || 0;

      // For active subscriptions, we'd need a specific endpoint
      // For now, using total subscriptions as placeholder
      const activeSubscriptions = totalSubscriptions;

      setStats({
        totalUsers,
        totalGames,
        totalSubscriptions,
        activeSubscriptions,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to NeuroGame Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={PeopleIcon}
            color="primary"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Games"
            value={stats.totalGames}
            icon={GamesIcon}
            color="success"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Subscription Plans"
            value={stats.totalSubscriptions}
            icon={SubscriptionIcon}
            color="warning"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon={TrendingUpIcon}
            color="info"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use the sidebar to manage games, users, and subscriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
