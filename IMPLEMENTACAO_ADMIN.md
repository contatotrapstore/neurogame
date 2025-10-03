# Guia de Implementação - Dashboard Admin

Este documento contém todos os arquivos necessários para completar o Dashboard Admin React.

## Estrutura de Arquivos

```
neurogame-admin/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Games.jsx
│   │   ├── Plans.jsx
│   │   └── Subscriptions.jsx
│   ├── App.jsx
│   └── main.jsx (já criado)
```

## src/App.jsx

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Games from './pages/Games';
import Plans from './pages/Plans';
import Subscriptions from './pages/Subscriptions';

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated() ? <Navigate to="/" replace /> : <Login />
      } />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="games" element={<Games />} />
        <Route path="plans" element={<Plans />} />
        <Route path="subscriptions" element={<Subscriptions />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
```

## src/components/ProtectedRoute.jsx

```jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Acesso Negado</h2>
        <p>Você precisa ser um administrador para acessar esta página.</p>
      </div>
    );
  }

  return children;
}
```

## src/components/Layout.jsx

```jsx
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, People, SportsEsports,
  CardMembership, Subscriptions, AccountCircle, Logout
} from '@mui/icons-material';
import { clearAuthData, getUser } from '../utils/auth';
import { useSnackbar } from 'notistack';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Usuários', icon: <People />, path: '/users' },
  { text: 'Jogos', icon: <SportsEsports />, path: '/games' },
  { text: 'Planos', icon: <CardMembership />, path: '/plans' },
  { text: 'Assinaturas', icon: <Subscriptions />, path: '/subscriptions' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const user = getUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearAuthData();
    enqueueSnackbar('Logout realizado com sucesso', { variant: 'success' });
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 700 }}>
          NeuroGame
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.username}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
```

## src/pages/Login.jsx

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, TextField, Button, Typography, Container, Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { authAPI } from '../services/api';
import { setAuthData } from '../utils/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      const { user, token, refreshToken } = response.data.data;

      if (!user.isAdmin) {
        setError('Acesso negado. Apenas administradores podem fazer login.');
        setLoading(false);
        return;
      }

      setAuthData(token, refreshToken, user);
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
            NeuroGame Admin
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Dashboard Administrativo
          </Typography>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Usuário"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>

          <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 2 }}>
            Credenciais padrão: admin / Admin@123456
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
```

## src/pages/Dashboard.jsx

```jsx
import { useQuery } from '@tanstack/react-query';
import {
  Grid, Paper, Typography, Box, Card, CardContent
} from '@mui/material';
import { People, SportsEsports, CardMembership, TrendingUp } from '@mui/icons-material';
import { usersAPI, gamesAPI, subscriptionsAPI } from '../services/api';

export default function Dashboard() {
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getAll({ limit: 1000 })
  });

  const { data: gamesData } = useQuery({
    queryKey: ['games'],
    queryFn: () => gamesAPI.getAll()
  });

  const { data: subsData } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsAPI.getAll({ limit: 1000 })
  });

  const stats = [
    {
      title: 'Total de Usuários',
      value: usersData?.data?.data?.pagination?.total || 0,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#2196f3'
    },
    {
      title: 'Jogos Disponíveis',
      value: gamesData?.data?.data?.count || 0,
      icon: <SportsEsports sx={{ fontSize: 40 }} />,
      color: '#4caf50'
    },
    {
      title: 'Assinaturas Ativas',
      value: subsData?.data?.data?.pagination?.total || 0,
      icon: <CardMembership sx={{ fontSize: 40 }} />,
      color: '#ff9800'
    },
    {
      title: 'Taxa de Crescimento',
      value: '+12%',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#9c27b0'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Bem-vindo ao painel administrativo do NeuroGame
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

## Próximos Passos

1. Criar páginas restantes (Users, Games, Plans, Subscriptions) com tabelas e formulários
2. Implementar funcionalidades CRUD completas
3. Adicionar validações e tratamento de erros
4. Testar integração com backend

### Para instalar dependências:

```bash
cd neurogame-admin
npm install
```

### Para executar em desenvolvimento:

```bash
npm run dev
```

Dashboard rodará em `http://localhost:3001`
