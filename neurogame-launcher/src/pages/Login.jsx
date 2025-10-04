import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  alpha,
  useTheme,
  Link
} from '@mui/material';
import { Login as LoginIcon, VpnKey } from '@mui/icons-material';
import api from '../services/api';
import { setStoredToken, setStoredUser } from '../services/storage';
import logoUrl from '../assets/logo-branca.png';

function Login({ onLogin }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const value = event.target.value.toUpperCase();
    setAccessCode(value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!accessCode.trim()) {
      setError('Informe seu código de acesso');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login-code', {
        access_code: accessCode
      });

      const { token, user } = response.data;

      await setStoredToken(token);
      await setStoredUser(user);

      onLogin();
      navigate('/library');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Código de acesso inválido. Verifique e tente novamente.');
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
        backgroundColor: '#070d0a',
        backgroundImage:
          'radial-gradient(circle at 25% 20%, rgba(31,138,76,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(8,15,11,0.8), transparent 55%)',
        px: 2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 960,
          borderRadius: 4,
          overflow: 'hidden',
          display: { xs: 'block', md: 'flex' },
          border: '1px solid rgba(55,126,86,0.25)'
        }}
      >
        <Box
          sx={{
            flex: 1,
            backgroundImage: theme.palette?.gradient?.primary,
            p: { xs: 4, md: 6 },
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
              <Box
                component="img"
                src={logoUrl}
                alt="NeuroGame Logo"
                sx={{ height: 48, width: 'auto' }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.16em' }}>
                  NEUROGAME
                </Typography>
                <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.8) }}>
                  Plataforma de jogos neuroeducacionais
                </Typography>
              </Box>
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Bem-vindo de volta!
            </Typography>
            <Typography variant="body1" sx={{ color: alpha('#ffffff', 0.76), mb: 4 }}>
              Acesse sua biblioteca e continue seus treinamentos personalizados.
            </Typography>

            <Stack spacing={3} sx={{ color: alpha('#ffffff', 0.8) }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  +13 jogos
                </Typography>
                <Typography variant="caption">Coleção focada em habilidades cognitivas</Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Monitoramento inteligente
                </Typography>
                <Typography variant="caption">Resultados sincronizados com sua conta NeuroGame</Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.65) }}>
            © {new Date().getFullYear()} NeuroGame. Todos os direitos reservados.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: { xs: 4, md: 6 },
            background: 'linear-gradient(160deg, rgba(7,13,10,0.95) 0%, rgba(9,18,14,0.95) 100%)'
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Acesso com Código
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use o código fornecido no site{' '}
                <Link
                  href="https://neuromodulando.com.br"
                  target="_blank"
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  neuromodulando.com.br
                </Link>
              </Typography>
            </Box>

            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Código de Acesso"
                name="access_code"
                value={accessCode}
                onChange={handleChange}
                autoComplete="off"
                autoFocus
                fullWidth
                variant="outlined"
                size="medium"
                placeholder="NEURO-XXXX-XXXX"
                InputProps={{
                  startAdornment: <VpnKey sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                helperText="Digite o código no formato: NEURO-XXXX-XXXX"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={!loading ? <LoginIcon /> : null}
                disabled={loading}
                sx={{ py: 1.3, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Não tem um código?
              </Typography>
              <Link
                href="https://neuromodulando.com.br"
                target="_blank"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Obtenha seu código no site NeuroModulando
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
