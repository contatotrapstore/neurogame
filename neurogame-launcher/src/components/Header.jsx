import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  SportsEsports,
  Logout,
  ArrowBack,
  Refresh
} from '@mui/icons-material';
import { getStoredUser } from '../services/storage';
import { logout } from '../utils/auth';

function Header({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getStoredUser();
    setUser(userData);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    onLogout();
    navigate('/login');
  };

  const handleBackToLibrary = () => {
    navigate('/library');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const isGamePage = location.pathname.startsWith('/game/');

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <SportsEsports sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NeuroGame
        </Typography>

        {isGamePage && (
          <Button
            color="inherit"
            startIcon={<ArrowBack />}
            onClick={handleBackToLibrary}
            sx={{ mr: 2 }}
          >
            Back to Library
          </Button>
        )}

        {!isGamePage && (
          <IconButton color="inherit" onClick={handleRefresh} sx={{ mr: 1 }}>
            <Refresh />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name || user?.email || 'User'}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="account menu"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircle />}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { mt: 1, minWidth: 200 }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
