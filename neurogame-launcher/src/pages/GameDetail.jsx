import { useState, useEffect } from 'react';
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
  Divider
} from '@mui/material';
import {
  PlayArrow,
  ArrowBack,
  Info,
  Folder,
  Category,
  Lock
} from '@mui/icons-material';
import GameWebView from '../components/GameWebView';
import api from '../services/api';
import { getGamesPath } from '../services/storage';

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
    folderPath: rawGame.folder_path || rawGame.folderPath || '',
    slug: rawGame.slug || '',
    order: rawGame.order ?? rawGame.order_index ?? null,
    hasAccess: rawGame.hasAccess ?? rawGame.has_access ?? false,
    accessType: rawGame.accessType || rawGame.access_type || null
  };
};

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gamePath, setGamePath] = useState('');

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
      setError(err.message || 'Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async () => {
    if (!game) return;

    setValidating(true);
    setError('');

    try {
      const response = await api.get(`/games/${id}/validate`);
      const payload = response.data?.data || {};
      const hasAccess = payload.hasAccess ?? payload.has_access ?? false;

      if (!hasAccess) {
        setError(payload.message || 'You do not have access to this game. Please contact your administrator.');
        return;
      }

      const gamesBasePath = await getGamesPath();
      if (!gamesBasePath) {
        setError('Unable to resolve the local games directory.');
        return;
      }

      const targetPath = `${gamesBasePath}/${game.folderPath}/index.html`;
      setGamePath(targetPath);
      setIsPlaying(true);
    } catch (err) {
      console.error('Error validating game access:', err);
      setError(err.message || 'Failed to validate game access');
    } finally {
      setValidating(false);
    }
  };

  const handleBackToLibrary = () => {
    navigate('/library');
  };

  const handleExitGame = () => {
    setIsPlaying(false);
    setGamePath('');
  };

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Game not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToLibrary}
          sx={{ mt: 2 }}
        >
          Back to Library
        </Button>
      </Container>
    );
  }

  if (isPlaying && gamePath) {
    return <GameWebView gamePath={gamePath} onExit={handleExitGame} />;
  }

  const thumbnailUrl = game.coverImage || `https://via.placeholder.com/800x450/667eea/ffffff?text=${encodeURIComponent(game.name)}`;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBackToLibrary}
        sx={{ mb: 3 }}
      >
        Back to Library
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ overflow: 'hidden' }}>
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
                    label="Access required"
                    color="warning"
                  />
                )}
              </Stack>
            </Box>

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
              {validating ? 'Validating...' : game.hasAccess === false ? 'Request Access' : 'Play Now'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="600">
                About This Game
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" paragraph>
              {game.description || 'No description available for this game.'}
            </Typography>
          </Box>

          {game.instructions && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                How to Play
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {game.instructions}
              </Typography>
            </Box>
          )}

          {game.controls && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Controls
              </Typography>
              <Typography variant="body1" color="text.secondary">
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
