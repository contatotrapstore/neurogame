import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  SportsEsports as GamesIcon,
  People as PeopleIcon,
  CardMembership as SubscriptionIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material'

const menuItems = [
  { text: 'Painel', icon: DashboardIcon, path: '/' },
  { text: 'Jogos', icon: GamesIcon, path: '/games' },
  { text: 'Usuários', icon: PeopleIcon, path: '/users' },
  { text: 'Requisições', icon: NotificationsIcon, path: '/requests' },
]

const Sidebar = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
    if (mobileOpen) {
      onDrawerToggle()
    }
  }

  const drawer = (
    <Box
      sx={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        pb: 2,
        backgroundImage: theme.palette?.gradient?.sidebar,
      }}
    >
      <Toolbar
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
          gap: 1,
        }}
      >
        <img
          src="/logo-branca.png"
          alt="NeuroGame"
          style={{ width: '70%', maxWidth: 160 }}
        />
        <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.75), letterSpacing: '0.12em' }}>
          Plataforma Educacional
        </Typography>
      </Toolbar>
      <List sx={{ px: 2, mt: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            location.pathname === item.path || (item.path === '/' && location.pathname === '/')

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 0,
                  px: 2,
                  py: 1.2,
                  color: isActive ? '#ffffff' : alpha('#ffffff', 0.78),
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: alpha('#ffffff', 0.18),
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.22),
                    },
                    transform: 'translateX(6px)',
                  },
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.12),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#ffffff' : alpha('#ffffff', 0.65),
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.02em',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ px: 3, pt: 2 }}>
        <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.5), lineHeight: 1.4 }}>
          Gerencie jogos e usuários em um só lugar.
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
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
            width: drawerWidth,
            border: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Sidebar
