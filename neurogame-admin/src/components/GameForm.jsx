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
  Switch,
  MenuItem,
  InputAdornment,
  Chip
} from '@mui/material';

// Helper para gerar slug automático
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-'); // Remove hífens duplicados
};

// Helper para formatar bytes em MB
const formatBytes = (bytes) => {
  if (!bytes) return '';
  return (bytes / (1024 * 1024)).toFixed(2);
};

// Helper para converter MB em bytes
const mbToBytes = (mb) => {
  if (!mb || mb === '') return null;
  return Math.round(parseFloat(mb) * 1024 * 1024);
};

const defaultState = {
  name: '',
  slug: '',
  description: '',
  category: '',
  folderPath: '',
  coverImage: '',
  coverImageLocal: '',
  version: '1.0.0',
  downloadUrl: '',
  fileSize: null,
  checksum: '',
  installerType: 'exe',
  minimumDiskSpace: null,
  order: 0,
  isActive: true
};

const GameForm = ({ open, onClose, onSave, game }) => {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [fileSizeMB, setFileSizeMB] = useState('');
  const [diskSpaceMB, setDiskSpaceMB] = useState('');

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        slug: game.slug || '',
        description: game.description || '',
        category: game.category || '',
        folderPath: game.folderPath || '',
        coverImage: game.coverImage || '',
        coverImageLocal: game.coverImageLocal || '',
        version: game.version || '1.0.0',
        downloadUrl: game.downloadUrl || '',
        fileSize: game.fileSize || null,
        checksum: game.checksum || '',
        installerType: game.installerType || 'exe',
        minimumDiskSpace: game.minimumDiskSpace || null,
        order: game.order ?? 0,
        isActive: game.isActive ?? true
      });
      setFileSizeMB(formatBytes(game.fileSize));
      setDiskSpaceMB(formatBytes(game.minimumDiskSpace));
    } else {
      setFormData(defaultState);
      setFileSizeMB('');
      setDiskSpaceMB('');
    }
    setErrors({});
  }, [game, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Auto-gerar slug quando nome mudar (apenas em criação)
    if (name === 'name' && !game) {
      const autoSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: autoSlug
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSizeChange = (event) => {
    const mb = event.target.value;
    setFileSizeMB(mb);
    setFormData((prev) => ({
      ...prev,
      fileSize: mbToBytes(mb)
    }));
  };

  const handleDiskSpaceChange = (event) => {
    const mb = event.target.value;
    setDiskSpaceMB(mb);
    setFormData((prev) => ({
      ...prev,
      minimumDiskSpace: mbToBytes(mb)
    }));
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
      coverImageLocal: formData.coverImageLocal.trim(),
      version: formData.version.trim() || '1.0.0',
      downloadUrl: formData.downloadUrl.trim(),
      fileSize: formData.fileSize,
      checksum: formData.checksum.trim(),
      installerType: formData.installerType || 'exe',
      minimumDiskSpace: formData.minimumDiskSpace,
      order: Number(formData.order) || 0,
      isActive: formData.isActive
    };

    onSave(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 0 }
      }}
    >
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
              helperText={errors.slug || (game ? 'URL única do jogo' : '✨ Gerado automaticamente')}
              required
              disabled={!game}
              InputProps={{
                endAdornment: !game && formData.slug && (
                  <InputAdornment position="end">
                    <Chip label="Auto" size="small" color="primary" variant="outlined" />
                  </InputAdornment>
                )
              }}
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
              select
              label="Categoria"
              name="category"
              value={formData.category}
              onChange={handleChange}
              helperText="Selecione a categoria do jogo"
            >
              <MenuItem value="">Nenhuma</MenuItem>
              <MenuItem value="Ação">Ação</MenuItem>
              <MenuItem value="Aventura">Aventura</MenuItem>
              <MenuItem value="Corrida">Corrida</MenuItem>
              <MenuItem value="Educativo">Educativo</MenuItem>
              <MenuItem value="Estratégia">Estratégia</MenuItem>
              <MenuItem value="Puzzle">Puzzle</MenuItem>
              <MenuItem value="Esportes">Esportes</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Caminho da Pasta"
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
              label="URL da Imagem de Capa"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              helperText="URL externa (opcional)"
              placeholder="https://exemplo.com/capa.jpg"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Caminho Local da Capa"
              name="coverImageLocal"
              value={formData.coverImageLocal}
              onChange={handleChange}
              helperText="Caminho no launcher (opcional)"
              placeholder="assets/covers/autorama.jpg"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Versão"
              name="version"
              value={formData.version}
              onChange={handleChange}
              helperText="Versão do jogo"
              placeholder="1.0.0"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Tipo de Instalador"
              name="installerType"
              value={formData.installerType}
              onChange={handleChange}
              helperText="Formato do arquivo"
            >
              <MenuItem value="exe">EXE (Windows)</MenuItem>
              <MenuItem value="msi">MSI (Windows)</MenuItem>
              <MenuItem value="zip">ZIP (Compactado)</MenuItem>
              <MenuItem value="dmg">DMG (macOS)</MenuItem>
              <MenuItem value="deb">DEB (Linux)</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Ordem"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              helperText="Posição na lista"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL de Download"
              name="downloadUrl"
              value={formData.downloadUrl}
              onChange={handleChange}
              helperText="URL completa para download do instalador (opcional)"
              placeholder="https://cdn.neurogame.com.br/jogos/autorama.exe"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tamanho do Arquivo (MB)"
              type="number"
              value={fileSizeMB}
              onChange={handleFileSizeChange}
              helperText="Tamanho do instalador em megabytes"
              placeholder="50"
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <InputAdornment position="end">MB</InputAdornment>
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Espaço Mínimo (MB)"
              type="number"
              value={diskSpaceMB}
              onChange={handleDiskSpaceChange}
              helperText="Espaço necessário para instalar"
              placeholder="100"
              InputProps={{
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <InputAdornment position="end">MB</InputAdornment>
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Checksum SHA256 (opcional)"
              name="checksum"
              value={formData.checksum}
              onChange={handleChange}
              helperText="Hash SHA256 para validar integridade do download"
              placeholder="a1b2c3d4e5f6..."
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange}
                  name="isActive"
                  color="primary"
                />
              }
              label={`Jogo ${formData.isActive ? 'Ativo' : 'Inativo'} (${formData.isActive ? 'visível para usuários' : 'oculto'})`}
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
