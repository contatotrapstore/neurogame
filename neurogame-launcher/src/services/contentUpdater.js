import api from './api';

/**
 * Content Updater Service
 * Gerencia atualizações de jogos e conteúdo do launcher
 */

const STORAGE_KEY_CONTENT_VERSION = 'contentVersion';
const STORAGE_KEY_INSTALLED_GAMES = 'installedGames';

class ContentUpdater {
  constructor() {
    this.checkInterval = null;
  }

  /**
   * Verifica se há novos jogos ou atualizações disponíveis
   */
  async checkForUpdates() {
    try {
      const lastSyncVersion = await this.getLastSyncVersion();

      const response = await api.get('/games/updates', {
        params: { lastSyncVersion }
      });

      const { hasUpdates, contentVersion, newGames, games } = response.data.data;

      if (hasUpdates) {
        console.log(`[ContentUpdater] ${newGames} novos jogos disponíveis`);

        return {
          hasUpdates: true,
          newGamesCount: newGames,
          games: games,
          contentVersion
        };
      }

      console.log('[ContentUpdater] Nenhuma atualização disponível');
      return {
        hasUpdates: false,
        newGamesCount: 0,
        games: []
      };
    } catch (error) {
      console.error('[ContentUpdater] Erro ao verificar atualizações:', error);
      throw error;
    }
  }

  /**
   * Baixa e instala novos jogos
   */
  async downloadNewGames(games) {
    const results = [];

    for (const game of games) {
      try {
        console.log(`[ContentUpdater] Baixando ${game.title}...`);

        // Aqui você implementaria o download real
        // Por enquanto, vamos simular
        await this.downloadGame(game);

        results.push({
          gameId: game.id,
          title: game.title,
          success: true
        });

        // Registrar game como instalado
        await this.markGameAsInstalled(game.id);
      } catch (error) {
        console.error(`[ContentUpdater] Erro ao baixar ${game.title}:`, error);
        results.push({
          gameId: game.id,
          title: game.title,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Simula download de jogo (substituir por implementação real)
   */
  async downloadGame(game) {
    // TODO: Implementar download real usando electron-dl ou axios
    // Por enquanto, apenas simula
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  /**
   * Atualiza a versão local do conteúdo
   */
  async updateContentVersion(version) {
    if (window.electronAPI) {
      await window.electronAPI.store.set(STORAGE_KEY_CONTENT_VERSION, version);
    } else {
      localStorage.setItem(STORAGE_KEY_CONTENT_VERSION, version.toString());
    }
  }

  /**
   * Obtém a última versão sincronizada
   */
  async getLastSyncVersion() {
    if (window.electronAPI) {
      return await window.electronAPI.store.get(STORAGE_KEY_CONTENT_VERSION);
    } else {
      return localStorage.getItem(STORAGE_KEY_CONTENT_VERSION);
    }
  }

  /**
   * Marca um jogo como instalado
   */
  async markGameAsInstalled(gameId) {
    let installedGames = await this.getInstalledGames();
    if (!installedGames.includes(gameId)) {
      installedGames.push(gameId);

      if (window.electronAPI) {
        await window.electronAPI.store.set(STORAGE_KEY_INSTALLED_GAMES, installedGames);
      } else {
        localStorage.setItem(STORAGE_KEY_INSTALLED_GAMES, JSON.stringify(installedGames));
      }
    }
  }

  /**
   * Obtém lista de jogos instalados
   */
  async getInstalledGames() {
    if (window.electronAPI) {
      const games = await window.electronAPI.store.get(STORAGE_KEY_INSTALLED_GAMES);
      return games || [];
    } else {
      const games = localStorage.getItem(STORAGE_KEY_INSTALLED_GAMES);
      return games ? JSON.parse(games) : [];
    }
  }

  /**
   * Inicia verificação periódica de atualizações
   */
  startPeriodicCheck(intervalMinutes = 30) {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Verificar imediatamente
    this.checkForUpdates();

    // Verificar periodicamente
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, intervalMinutes * 60 * 1000);

    console.log(`[ContentUpdater] Verificação periódica iniciada (${intervalMinutes} min)`);
  }

  /**
   * Para verificação periódica
   */
  stopPeriodicCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('[ContentUpdater] Verificação periódica parada');
    }
  }

  /**
   * Força atualização obrigatória
   */
  async forceUpdate() {
    try {
      const updates = await this.checkForUpdates();

      if (updates.hasUpdates && updates.newGamesCount > 0) {
        console.log('[ContentUpdater] Iniciando atualização obrigatória...');

        const results = await this.downloadNewGames(updates.games);

        // Atualizar versão local
        await this.updateContentVersion(updates.contentVersion);

        return {
          success: true,
          results
        };
      }

      return {
        success: true,
        message: 'Nenhuma atualização necessária'
      };
    } catch (error) {
      console.error('[ContentUpdater] Erro na atualização forçada:', error);
      throw error;
    }
  }
}

export default new ContentUpdater();
