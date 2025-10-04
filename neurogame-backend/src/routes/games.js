const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * GET /api/v1/games/updates
 * Verificar se há novos jogos ou atualizações disponíveis
 */
router.get('/updates', authenticate, async (req, res) => {
  try {
    const { lastSyncVersion } = req.query;

    // Buscar todos os jogos ativos
    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Versão atual do conteúdo (baseada no jogo mais recente)
    const latestGame = games[0];
    const currentContentVersion = latestGame ? new Date(latestGame.created_at).getTime() : 0;

    // Verificar se há atualizações
    const hasUpdates = !lastSyncVersion || currentContentVersion > parseInt(lastSyncVersion);

    // Filtrar apenas novos jogos se houver lastSyncVersion
    let newGames = games;
    if (lastSyncVersion) {
      newGames = games.filter(game =>
        new Date(game.created_at).getTime() > parseInt(lastSyncVersion)
      );
    }

    res.json({
      success: true,
      data: {
        hasUpdates,
        contentVersion: currentContentVersion,
        totalGames: games.length,
        newGames: newGames.length,
        games: newGames
      }
    });
  } catch (error) {
    console.error('Error checking for game updates:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar atualizações de jogos'
    });
  }
});

/**
 * GET /api/v1/games/manifest
 * Retorna manifest com versão e lista de jogos
 */
router.get('/manifest', authenticate, async (req, res) => {
  try {
    const { data: games, error } = await supabase
      .from('games')
      .select('id, title, version, download_url, file_size, checksum, created_at, updated_at')
      .eq('is_active', true)
      .order('title', { ascending: true });

    if (error) throw error;

    // Calcular versão do manifest (timestamp do jogo mais recente)
    const manifestVersion = games.length > 0
      ? Math.max(...games.map(g => new Date(g.updated_at || g.created_at).getTime()))
      : Date.now();

    res.json({
      success: true,
      data: {
        manifestVersion,
        generatedAt: new Date().toISOString(),
        totalGames: games.length,
        games: games.map(game => ({
          id: game.id,
          title: game.title,
          version: game.version || '1.0.0',
          downloadUrl: game.download_url,
          fileSize: game.file_size,
          checksum: game.checksum,
          updatedAt: game.updated_at || game.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Error getting games manifest:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao obter manifest de jogos'
    });
  }
});

/**
 * POST /api/v1/games/:gameId/download-track
 * Registrar download de jogo pelo usuário
 */
router.post('/:gameId/download-track', authenticate, async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    // Registrar download
    const { error } = await supabase
      .from('game_downloads')
      .insert([{
        user_id: userId,
        game_id: gameId,
        downloaded_at: new Date().toISOString()
      }]);

    if (error && error.code !== '23505') { // Ignorar erro de duplicata
      throw error;
    }

    res.json({
      success: true,
      message: 'Download registrado'
    });
  } catch (error) {
    console.error('Error tracking game download:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar download'
    });
  }
});

module.exports = router;
