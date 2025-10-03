import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Stack
} from '@mui/material';
import { Search, CloudOff } from '@mui/icons-material';
import GameCard from '../components/GameCard';
import api from '../services/api';

const normalizeGame = (rawGame) => {
  if (!rawGame) return null;

  return {
    id: rawGame.id,
    name: rawGame.name || rawGame.title || 'Untitled Game',
    description: rawGame.description || '',
    category: rawGame.category || null,
    coverImage: rawGame.cover_image || rawGame.thumbnail_url || '',
    folderPath: rawGame.folder_path || rawGame.folderPath || '',
    hasAccess: rawGame.hasAccess ?? rawGame.has_access ?? false,
    accessType: rawGame.accessType || rawGame.access_type || null
  };
};

function GameLibrary() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchGames();

    if (window.electronAPI) {
      const refreshListener = () => fetchGames();
      window.electronAPI.on('refresh-library', refreshListener);
      return () => {
        window.electronAPI.removeListener('refresh-library', refreshListener);
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    filterGames();
  }, [games, searchQuery, selectedCategory]);

  const fetchGames = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/games/user/games');
      const payload = response.data?.data || {};
      const gamesData = payload.games || [];

      const normalized = gamesData
        .map(normalizeGame)
        .filter(Boolean);

      setGames(normalized);

      const uniqueCategories = [
        ...new Set(
          normalized
            .map((game) => game.category)
            .filter(Boolean)
        )
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching games:', err);
      if (err.offline) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError(err.message || 'Failed to load games');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = [...games];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((game) => {
        return (
          game.name.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.category?.toLowerCase().includes(query)
        );
      });
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((game) => game.category === selectedCategory);
    }

    setFilteredGames(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          My Game Library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {games.length} game{games.length !== 1 ? 's' : ''} available
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          icon={<CloudOff />}
          sx={{ mb: 3 }}
          action={
            <Typography
              variant="button"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={fetchGames}
            >
              Retry
            </Typography>
          }
        >
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search games..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ maxWidth: 600, mb: 2 }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label="All"
            onClick={() => handleCategoryChange('all')}
            color={selectedCategory === 'all' ? 'primary' : 'default'}
            sx={{ mb: 1 }}
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      {filteredGames.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {searchQuery || selectedCategory !== 'all'
              ? 'No games match your filters'
              : 'No games available'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Contact your administrator to get access to games'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredGames.map((game) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
              <GameCard game={game} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default GameLibrary;
