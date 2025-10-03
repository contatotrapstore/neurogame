import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  CardActionArea
} from '@mui/material';
import { PlayArrow, Folder, Lock } from '@mui/icons-material';

const buildFallbackCover = (name) => {
  const label = encodeURIComponent(name || 'NeuroGame');
  return `https://via.placeholder.com/400x225/667eea/ffffff?text=${label}`;
};

function GameCard({ game }) {
  const navigate = useNavigate();
  const coverImage = game.coverImage || buildFallbackCover(game.name);
  const hasAccess = game.hasAccess !== false;

  const handlePlayClick = (event) => {
    event.stopPropagation();
    navigate(`/game/${game.id}`);
  };

  const handleCardClick = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="180"
          image={coverImage}
          alt={game.name}
          sx={{
            objectFit: 'cover',
            bgcolor: 'grey.800'
          }}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            noWrap
            sx={{ fontWeight: 600 }}
          >
            {game.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {game.description || 'No description available'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {game.category && (
              <Chip
                label={game.category}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {game.folderPath && (
              <Chip
                icon={<Folder />}
                label="Local"
                size="small"
                variant="outlined"
              />
            )}
            {!hasAccess && (
              <Chip
                icon={<Lock />}
                label="Access required"
                size="small"
                color="warning"
              />
            )}
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={handlePlayClick}
          sx={{
            py: 1,
            fontWeight: 600
          }}
        >
          {hasAccess ? 'Play Now' : 'Request Access'}
        </Button>
      </Box>
    </Card>
  );
}

export default GameCard;
