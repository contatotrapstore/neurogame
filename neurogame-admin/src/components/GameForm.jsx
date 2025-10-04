import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch
} from '@mui/material';

const defaultState = {
  name: '',
  slug: '',
  description: '',
  category: '',
  folderPath: '',
  coverImage: '',
  order: 0,
  isActive: true
};

const GameForm = ({ open, onClose, onSave, game }) => {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        slug: game.slug || '',
        description: game.description || '',
        category: game.category || '',
        folderPath: game.folderPath || '',
        coverImage: game.coverImage || '',
        order: game.order ?? 0,
        isActive: game.isActive ?? true
      });
    } else {
      setFormData(defaultState);
    }
    setErrors({});
  }, [game, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Nome do jogo é obrigatório';
    }

    if (!formData.slug.trim()) {
      nextErrors.slug = 'Slug é obrigatório';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      nextErrors.slug = 'Use apenas letras minúsculas, números e hífens';
    }

    if (!formData.folderPath.trim()) {
      nextErrors.folderPath = 'Caminho da pasta é obrigatório';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      folderPath: formData.folderPath.trim(),
      coverImage: formData.coverImage.trim(),
      order: Number(formData.order) || 0,
      isActive: formData.isActive
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{game ? 'Editar Jogo' : 'Criar Novo Jogo'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do jogo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              error={Boolean(errors.slug)}
              helperText={errors.slug || 'Letras minúsculas, números e hífen'}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Categoria"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Caminho da pasta"
              name="folderPath"
              value={formData.folderPath}
              onChange={handleChange}
              error={Boolean(errors.folderPath)}
              helperText={errors.folderPath || 'Ex: Jogos/autorama'}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="URL da imagem de capa"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ordem"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Ativo"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          {game ? 'Atualizar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameForm;
