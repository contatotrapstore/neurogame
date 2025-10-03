import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import api from '../services/api';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchUsers();
    fetchSubscriptionPlans();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
        setFilteredUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      if (response.data.success) {
        setSubscriptionPlans(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
    }
  };

  const handleOpenForm = (user = null) => {
    setEditingUser(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        const response = await api.put(`/users/${editingUser._id}`, userData);
        if (response.data.success) {
          setUsers(users.map((u) => (u._id === editingUser._id ? response.data.data : u)));
          showSnackbar('User updated successfully', 'success');
        }
      } else {
        // Create new user
        const response = await api.post('/users', userData);
        if (response.data.success) {
          setUsers([...users, response.data.data]);
          showSnackbar('User created successfully', 'success');
        }
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error saving user:', err);
      showSnackbar(err.response?.data?.message || 'Failed to save user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        showSnackbar('User deleted successfully', 'success');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const handleAssignSubscription = async (userId, subscriptionPlanId) => {
    try {
      const response = await api.put(`/users/${userId}`, {
        subscriptionPlanId,
      });
      if (response.data.success) {
        setUsers(users.map((u) => (u._id === userId ? response.data.data : u)));
        showSnackbar('Subscription assigned successfully', 'success');
      }
    } catch (err) {
      console.error('Error assigning subscription:', err);
      showSnackbar(err.response?.data?.message || 'Failed to assign subscription', 'error');
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
            Users Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all users in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
          size="large"
        >
          Add User
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search users by username, email, or name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <UserTable
          users={filteredUsers}
          subscriptionPlans={subscriptionPlans}
          onEdit={handleOpenForm}
          onDelete={handleDeleteUser}
          onAssignSubscription={handleAssignSubscription}
        />
      )}

      <UserForm
        open={openForm}
        onClose={handleCloseForm}
        onSave={handleSaveUser}
        user={editingUser}
        subscriptionPlans={subscriptionPlans}
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

export default Users;
