import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { usersAPI, subscriptionsAPI } from '../services/api';
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
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
    fetchSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const { users: fetchedUsers } = await usersAPI.getAll({ limit: 500 });
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const { plans } = await subscriptionsAPI.getAllPlans({ isActive: true, limit: 100 });
      setSubscriptionPlans(plans);
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
        const updatedUser = await usersAPI.update(editingUser.id, userData);
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        showSnackbar('User updated successfully', 'success');
      } else {
        const newUser = await usersAPI.create(userData);
        setUsers((prev) => [...prev, newUser]);
        showSnackbar('User created successfully', 'success');
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error saving user:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Failed to save user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      showSnackbar('User deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Failed to delete user', 'error');
    }
  };

  const handleAssignSubscription = async (userId, planId, durationDays) => {
    try {
      await subscriptionsAPI.assignSubscription({ userId, planId, durationDays });
      await fetchUsers();
      showSnackbar('Subscription assigned successfully', 'success');
    } catch (err) {
      console.error('Error assigning subscription:', err);
      showSnackbar(err.response?.data?.message || err.message || 'Failed to assign subscription', 'error');
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
          )
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
