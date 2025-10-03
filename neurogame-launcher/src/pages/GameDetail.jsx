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
  Category
} from '@mui/icons-material';
import GameWebView from '../components/GameWebView';
import api from '../services/api';
import { getGamesPath } from '../services/storage';

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
      // Fetch game details from backend
      const response = await api.get(`/games/${id}`);
      const gameData = response.data.game || response.data;
      setGame(gameData);
    } catch (err) {
      console.error('Error fetching game details:', err);
      setError(err.message || 'Failed to load game details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async () => {
    setValidating(true);
    setError('');

    try {
      // Validate access with backend
      const response = await api.get(`/games/${id}/validate`);

      if (response.data.hasAccess) {
        // Get local games path
        const gamesBasePath = await getGamesPath();
        const fullGamePath = `${gamesBasePath}/${game.folder_path}/index.html`;

        setGamePath(fullGamePath);
        setIsPlaying(true);
      } else {
        setError('You do not have access to this game. Please contact your administrator.');
      }
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

  const thumbnailUrl = game.thumbnail_url || `https://via.placeholder.com/800x450/667eea/ffffff?text=${encodeURIComponent(game.title)}`;

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
          alt={game.title}
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
                {game.title}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {game.category && (
                  <Chip
                    icon={<Category />}
                    label={game.category}
                    color="primary"
                  />
                )}
                {game.folder_path && (
                  <Chip
                    icon={<Folder />}
                    label={game.folder_path}
                    variant="outlined"
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
              {validating ? 'Validating...' : 'Play Now'}
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
            <Box>
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
