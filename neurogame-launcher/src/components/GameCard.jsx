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
import { PlayArrow, Folder } from '@mui/icons-material';

function GameCard({ game }) {
  const navigate = useNavigate();

  const handlePlayClick = (e) => {
    e.stopPropagation();
    navigate(`/game/${game.id}`);
  };

  const handleCardClick = () => {
    navigate(`/game/${game.id}`);
  };

  // Generate placeholder image if no thumbnail
  const thumbnailUrl = game.thumbnail_url || `https://via.placeholder.com/400x225/667eea/ffffff?text=${encodeURIComponent(game.title)}`;

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
          image={thumbnailUrl}
          alt={game.title}
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
            {game.title}
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
            {game.folder_path && (
              <Chip
                icon={<Folder />}
                label="Local"
                size="small"
                variant="outlined"
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
          Play Now
        </Button>
      </Box>
    </Card>
  );
}

export default GameCard;
