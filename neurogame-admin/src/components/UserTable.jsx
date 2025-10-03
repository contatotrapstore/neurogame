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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CardMembership as SubscriptionIcon,
} from '@mui/icons-material';

const UserTable = ({ users, subscriptionPlans, onEdit, onDelete, onAssignSubscription }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAssignDialog = (user) => {
    setSelectedUser(user);
    setSelectedPlanId(user.subscriptionPlanId || '');
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedUser(null);
    setSelectedPlanId('');
  };

  const handleAssignSubmit = () => {
    if (selectedUser && selectedPlanId) {
      onAssignSubscription(selectedUser._id, selectedPlanId);
    }
    handleCloseAssignDialog();
  };

  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subscription</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                const userPlan = subscriptionPlans.find(
                  (plan) => plan._id === user.subscriptionPlanId
                );

                return (
                  <TableRow key={user._id} hover>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role || 'user'}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {userPlan ? (
                        <Chip label={userPlan.name} size="small" color="success" />
                      ) : (
                        <Chip label="None" size="small" variant="outlined" />
                      )}
                    </TableCell>
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
                          onClick={() => onDelete(user._id)}
                          title="Delete User"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
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
              onChange={(e) => setSelectedPlanId(e.target.value)}
              label="Subscription Plan"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {subscriptionPlans.map((plan) => (
                <MenuItem key={plan._id} value={plan._id}>
                  {plan.name} - ${plan.price}/{plan.billingCycle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleAssignSubmit} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
