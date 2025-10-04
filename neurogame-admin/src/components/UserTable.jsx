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
      return <Chip label="Nenhuma" size="small" variant="outlined" />;
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
              <TableCell sx={{ fontWeight: 'bold' }}>Nome de usuário</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome completo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Função</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Assinatura</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email || '�'}</TableCell>
                  <TableCell>{user.fullName || '�'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.isAdmin ? 'Admin' : 'Usuário'}
                      size="small"
                      color={user.isAdmin ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Ativo' : 'Inativo'}
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
                        title="Editar Usuário"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleOpenAssignDialog(user)}
                        title="Atribuir Assinatura"
                      >
                        <SubscriptionIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(user.id)}
                        title="Excluir Usuário"
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
        <DialogTitle>Atribuir Assinatura</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Plano de Assinatura</InputLabel>
            <Select
              value={selectedPlanId}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              label="Plano de Assinatura"
            >
              <MenuItem value="">
                <em>Nenhum</em>
              </MenuItem>
              {subscriptionPlans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} – R$ {plan.price} / {plan.durationDays}d
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Duração (dias)"
            type="number"
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
            placeholder="Padrão para duração do plano"
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseAssignDialog}>Cancelar</Button>
          <Button
            onClick={handleAssignSubmit}
            variant="contained"
            disabled={!selectedPlanId}
          >
            Atribuir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
