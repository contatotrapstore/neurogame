import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CardMembership as SubscriptionIcon
} from '@mui/icons-material';

const UserTable = ({ users, subscriptionPlans, onEdit, onDelete, onAssignSubscription }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [durationDays, setDurationDays] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAssignDialog = (user) => {
    setSelectedUser(user);
    const planId = user.subscription?.planId || '';
    setSelectedPlanId(planId);

    const defaultDuration = planId
      ? subscriptionPlans.find((plan) => plan.id === planId)?.durationDays || ''
      : '';

    setDurationDays(defaultDuration ? String(defaultDuration) : '');
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedUser(null);
    setSelectedPlanId('');
    setDurationDays('');
  };

  const handleAssignSubmit = () => {
    if (selectedUser && selectedPlanId) {
      const parsedDuration = durationDays ? parseInt(durationDays, 10) : undefined;
      onAssignSubscription(selectedUser.id, selectedPlanId, parsedDuration);
    }
    handleCloseAssignDialog();
  };

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const renderSubscription = (user) => {
    if (!user.subscription) {
      return <Chip label="None" size="small" variant="outlined" />;
    }

    return (
      <Chip
        label={`${user.subscription.planName}`}
        size="small"
        color={user.subscription.isActive ? 'success' : 'default'}
      />
    );
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Full name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subscription</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email || '—'}</TableCell>
                  <TableCell>{user.fullName || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isAdmin ? 'Admin' : 'User'}
                      size="small"
                      color={user.isAdmin ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{renderSubscription(user)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(user)}
                        title="Edit User"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleOpenAssignDialog(user)}
                        title="Assign Subscription"
                      >
                        <SubscriptionIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(user.id)}
                        title="Delete User"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Subscription</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Subscription Plan</InputLabel>
            <Select
              value={selectedPlanId}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              label="Subscription Plan"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {subscriptionPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} • ${plan.price} / {plan.durationDays}d
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Duration (days)"
            type="number"
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
            placeholder="Defaults to plan duration"
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button
            onClick={handleAssignSubmit}
            variant="contained"
            disabled={!selectedPlanId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
