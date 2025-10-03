import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  SportsEsports as GameIcon,
} from '@mui/icons-material';

const GameCard = ({ game, onEdit, onDelete }) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: 'primary.lighter',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <GameIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" component="div" fontWeight="bold" noWrap>
            {game.name}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '60px',
          }}
        >
          {game.description || 'No description available'}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {game.category && (
            <Chip label={game.category} size="small" color="primary" variant="outlined" />
          )}
          {game.difficulty && (
            <Chip label={game.difficulty} size="small" color="secondary" variant="outlined" />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Version: {game.version || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Status: {game.isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(game)}
          variant="outlined"
        >
          Edit
        </Button>
        <IconButton
          size="small"
          onClick={() => onDelete(game._id)}
          color="error"
          sx={{ ml: 1 }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default GameCard;
