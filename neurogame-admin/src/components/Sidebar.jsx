import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SportsEsports as GamesIcon,
  People as PeopleIcon,
  CardMembership as SubscriptionIcon
} from '@mui/icons-material';

const menuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'Games', icon: GamesIcon, path: '/games' },
  { text: 'Users', icon: PeopleIcon, path: '/users' },
  { text: 'Subscriptions', icon: SubscriptionIcon, path: '/subscriptions' }
];

const Sidebar = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          backgroundColor: '#2D5F2E', // Verde da marca NeuroGame
          backgroundImage: 'linear-gradient(135deg, #2D5F2E 0%, #3A7D3C 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2
        }}
      >
        <img
          src="/logo-branca.png"
          alt="NeuroGame"
          style={{ width: '80%', maxWidth: '180px', marginBottom: '8px' }}
        />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/');

          return (
            <ListItem key={item.text} disablePadding sx={{ px: 2, mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: '#2D5F2E', // Verde da marca
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#3A7D3C'
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(45, 95, 46, 0.08)' // Verde suave no hover
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
