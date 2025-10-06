import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  PlayArrow,
  ArrowBack,
  Info,
  Folder,
  Category,
  Lock,
  Send
} from '@mui/icons-material';
import GameWebView from '../components/GameWebView';
import api from '../services/api';
import { getGamesPath } from '../services/storage';
import { gameRequestsApi } from '../services/gameRequestsApi';
import { generateGameSessionToken } from '../services/gameProtection';
import { buildGamePlaceholder } from '../utils/placeholders';

const sanitizeFolderPath = (value = '') => {
  if (!value) return '';
  return value
    .replace(/^\.?[\/]+/, '')
    .replace(/^jogos[\/]/i, '')
    .replace(/[\/]+$/, '');
};

const normalizeGame = (rawGame) => {
  if (!rawGame) return null;

  return {
    id: rawGame.id,
    name: rawGame.name || rawGame.title || 'Untitled Game',
    description: rawGame.description || '',
    instructions: rawGame.instructions || '',
    controls: rawGame.controls || '',
    category: rawGame.category || null,
    coverImage: rawGame.cover_image || rawGame.thumbnail_url || '',
    folderPath: sanitizeFolderPath(rawGame.folder_path || rawGame.folderPath || ''),
    slug: rawGame.slug || '',
    order: rawGame.order ?? rawGame.order_index ?? null,
    hasAccess: rawGame.hasAccess ?? rawGame.has_access ?? false,
    accessType: rawGame.accessType || rawGame.access_type || null
  };
};

function GameDetail() {
  const theme = useTheme();
  const mutedText = alpha(theme.palette.text.primary, 0.65);
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gamePath, setGamePath] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    fetchGameDetails();
  }, [id]);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/games/${id}`);
      const fetchedGame = normalizeGame(response.data?.data?.game || response.data?.game);

      if (!fetchedGame) {
        setError('Game not found');
        setGame(null);
        return;
      }

      setGame(fetchedGame);
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError(err.message || 'Falha ao carregar detalhes do jogo');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = useCallback(async () => {
    if (!game) return;

    setValidating(true);
    setError('');

    try {
      const response = await api.get(`/games/${id}/validate`);
      const payload = response.data?.data || {};
      const hasAccess = payload.hasAccess ?? payload.has_access ?? false;

      if (!hasAccess) {
        setError(payload.message || 'Você não tem acesso a este jogo. Entre em contato com seu administrador.');
        return;
      }

      // Verificar se o jogo está disponível para jogar
      if (!game.folderPath) {
        setError('Este jogo ainda não está disponível para download. Entre em contato com o administrador.');
        return;
      }

      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      await generateGameSessionToken(game.id, userData.id);

      const gamesBasePath = await getGamesPath();
      if (!gamesBasePath) {
        setError('Não foi possível localizar o diretório de jogos.');
        return;
      }

      const normalizedBase = gamesBasePath.replace(/[\/]+$/, '');
      const baseSeparator = normalizedBase.includes('\\') ? '\\' : '/';
      const currentFolder = game.folderPath || '';
      const isAbsolutePath = (
        /^[a-zA-Z]:[\/]/.test(currentFolder) ||
        currentFolder.startsWith('\\\\') ||
        currentFolder.startsWith('/') ||
        currentFolder.startsWith('file://')
      );

      let targetPath;

      if (currentFolder.startsWith('file://')) {
        targetPath = currentFolder;
      } else if (isAbsolutePath) {
        const normalizedFolder = currentFolder.replace(/[\/]+$/, '');
        const folderSeparator = normalizedFolder.includes('\\') ? '\\' : '/';
        targetPath = `${normalizedFolder}${folderSeparator}index.html`;
      } else {
        const segments = sanitizeFolderPath(currentFolder).split(/[\/]+/).filter(Boolean);
        const combinedPath = segments.reduce(
          (accumulator, segment) => `${accumulator}${baseSeparator}${segment}`,
          normalizedBase
        );
        targetPath = `${combinedPath}${baseSeparator}index.html`;
      }

      const normalizedTarget = targetPath.replace(/\\/g, '/');
      const encodedTarget = normalizedTarget.replace(/ /g, '%20');
      const fileUrl = encodedTarget.startsWith('file://')
        ? encodedTarget
        : `file://${encodedTarget.startsWith('/') ? '' : '/'}${encodedTarget}`;

      setGamePath(fileUrl);
      setIsPlaying(true);
    } catch (err) {
      console.error('Error validating game access:', err);
      setError(err.message || 'Falha ao validar acesso ao jogo');
    } finally {
      setValidating(false);
    }
  }, [game, id]);

  const handleBackToLibrary = () => {
    navigate('/library');
  };

  const handleExitGame = () => {
    setIsPlaying(false);
    setGamePath('');
  };

  const handleRequestAccess = async () => {
    if (!game) return;

    setRequesting(true);
    setError('');
    setRequestSuccess(false);

    try {
      await gameRequestsApi.create(game.id, `Solicitação de acesso ao jogo ${game.name}`);
      setRequestSuccess(true);
      setError('');
    } catch (err) {
      console.error('Error requesting game access:', err);
      setError(err.message || 'Falha ao solicitar acesso ao jogo');
      setRequestSuccess(false);
    } finally {
      setRequesting(false);
    }
  };

  useEffect(() => {
    if (!requestSuccess) {
      return undefined;
    }

    let cancelled = false;

    const pollForAccess = async () => {
      try {
        const response = await api.get(`/games/${id}/validate`);
        const payload = response.data?.data || {};
        const hasAccess = payload.hasAccess ?? payload.has_access ?? false;

        if (hasAccess && !cancelled) {
          setGame((prev) => (prev ? { ...prev, hasAccess: true } : prev));
          setRequestSuccess(false);
          setError('');
          handlePlayGame().catch((playError) => {
            console.error('Error launching game after approval:', playError);
          });
        }
      } catch (pollError) {
        if (!cancelled) {
          console.error('Error checking access after request:', pollError);
        }
      }
    };

    pollForAccess();
    const intervalId = setInterval(pollForAccess, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [requestSuccess, id, handlePlayGame]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!game) {
    return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, md: 5 },
        position: 'relative',
        background: 'radial-gradient(circle at top, rgba(31,138,76,0.12), transparent 55%)',
      }}
    >
        <Alert severity="error">Jogo não encontrado</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToLibrary}
          sx={{ mt: 2 }}
        >
          Voltar à Biblioteca
        </Button>
      </Container>
    );
  }

  if (isPlaying && gamePath) {
    return (
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        <GameWebView gamePath={gamePath} onExit={handleExitGame} />
      </Box>
    );
  }

  const thumbnailUrl = game.coverImage || buildGamePlaceholder(game.name, 800, 450);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 3, md: 5 },
        position: 'relative',
        background: 'radial-gradient(circle at top, rgba(31,138,76,0.12), transparent 55%)',
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBackToLibrary}
        sx={{ mb: 3 }}
      >
        Voltar à Biblioteca
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {requestSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Solicitação enviada com sucesso! Aguarde a aprovação do administrador.
        </Alert>
      )}

      <Card
        sx={{
          overflow: 'hidden',
          background: (theme.palette?.gradient?.card) || 'linear-gradient(160deg, rgba(24,39,31,0.88) 0%, rgba(8,15,11,0.94) 100%)',
          border: '1px solid rgba(55,126,86,0.18)',
          boxShadow: '0 22px 46px rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <CardMedia
          component="img"
          height="400"
          image={thumbnailUrl}
          alt={game.name}
          sx={{
            objectFit: 'cover',
            bgcolor: 'grey.800'
          }}
        />

        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3
            }}
          >
            <Box>
              <Typography variant="h3" gutterBottom fontWeight="bold">
                {game.name}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {game.category && (
                  <Chip
                    icon={<Category />}
                    label={game.category}
                    color="primary"
                  />
                )}
                {game.folderPath && (
                  <Chip
                    icon={<Folder />}
                    label={game.folderPath}
                    variant="outlined"
                  />
                )}
                {game.hasAccess === false && (
                  <Chip
                    icon={<Lock />}
                    label="Acesso necessário"
                    color="warning"
                  />
                )}
              </Stack>
            </Box>

            {game.hasAccess === false ? (
              <Button
                variant="contained"
                size="large"
                startIcon={requesting ? <CircularProgress size={20} /> : <Send />}
                onClick={handleRequestAccess}
                disabled={requesting || requestSuccess}
                color="warning"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {requesting ? 'Enviando...' : requestSuccess ? 'Solicitação Enviada' : 'Solicitar Acesso'}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={validating ? <CircularProgress size={20} /> : <PlayArrow />}
                onClick={handlePlayGame}
                disabled={validating}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                {validating ? 'Validando...' : 'Jogar Agora'}
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="600">
                Sobre Este Jogo
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: mutedText }} paragraph>
              {game.description || 'Nenhuma descrição disponível para este jogo.'}
            </Typography>
          </Box>

          {game.instructions && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Como Jogar
              </Typography>
              <Typography variant="body1" sx={{ color: mutedText }} paragraph>
                {game.instructions}
              </Typography>
            </Box>
          )}

          {game.controls && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Controles
              </Typography>
              <Typography variant="body1" sx={{ color: mutedText }}>
                {game.controls}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </Container>
  );
}

export default GameDetail;

