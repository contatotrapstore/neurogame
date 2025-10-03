import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container
} from '@mui/material';
import { SportsEsports } from '@mui/icons-material';
import api from '../services/api';
import { setStoredToken, setStoredUser } from '../services/storage';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;

      // Store token and user info
      await setStoredToken(token);
      await setStoredUser(user);

      // Notify parent component
      onLogin();

      // Navigate to library
      navigate('/library');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 450,
            mx: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <SportsEsports
                sx={{
                  fontSize: 64,
                  color: 'primary.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" gutterBottom>
                NeuroGame Launcher
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your game library
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, py: 1.5 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mt: 3 }}
            >
              Contact your administrator for access
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;
