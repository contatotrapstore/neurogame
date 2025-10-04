/**
 * Sistema de Proteção de Jogos
 * Garante que jogos só possam ser iniciados via launcher autenticado
 */

const GAME_SESSION_KEY = 'neurogame_game_session';
const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Gera um token de sessão para abrir um jogo
 */
export const generateGameSessionToken = async (gameId, userId) => {
  const sessionData = {
    gameId,
    userId,
    timestamp: Date.now(),
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
    nonce: crypto.randomUUID(),
  };

  // Salva no localStorage temporariamente
  localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(sessionData));

  return sessionData;
};

/**
 * Valida o token de sessão do jogo
 * Deve ser chamado DENTRO do jogo (no index.html)
 */
export const validateGameSession = (gameId) => {
  try {
    const sessionStr = localStorage.getItem(GAME_SESSION_KEY);

    if (!sessionStr) {
      throw new Error('Sessão não encontrada. Abra o jogo pelo launcher.');
    }

    const session = JSON.parse(sessionStr);

    // Verifica expiração
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(GAME_SESSION_KEY);
      throw new Error('Sessão expirada. Abra o jogo novamente pelo launcher.');
    }

    // Verifica se é o jogo correto
    if (session.gameId !== gameId) {
      throw new Error('Token inválido para este jogo.');
    }

    return {
      valid: true,
      userId: session.userId,
      gameId: session.gameId,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Limpa o token de sessão após o jogo ser carregado
 */
export const clearGameSession = () => {
  localStorage.removeItem(GAME_SESSION_KEY);
};

/**
 * Injeta script de proteção no jogo
 * Este script será incluído em todos os index.html dos jogos
 */
export const getProtectionScript = (gameId) => {
  return `
<script>
(function() {
  const GAME_ID = '${gameId}';
  const SESSION_KEY = 'neurogame_game_session';

  // Valida ao carregar a página
  window.addEventListener('DOMContentLoaded', function() {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);

      if (!sessionStr) {
        alert('⚠️ ERRO: Este jogo deve ser iniciado pelo NeuroGame Launcher!');
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:#fff;font-family:Arial,sans-serif;flex-direction:column;"><h1>🔒 Acesso Negado</h1><p>Este jogo deve ser aberto através do NeuroGame Launcher.</p><p style="color:#666;font-size:12px;margin-top:20px;">Código de erro: NO_SESSION</p></div>';
        return;
      }

      const session = JSON.parse(sessionStr);

      // Verifica expiração
      if (Date.now() > session.expiresAt) {
        alert('⚠️ ERRO: Sessão expirada. Abra o jogo novamente pelo launcher.');
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:#fff;font-family:Arial,sans-serif;flex-direction:column;"><h1>⏱️ Sessão Expirada</h1><p>Por favor, abra o jogo novamente através do NeuroGame Launcher.</p><p style="color:#666;font-size:12px;margin-top:20px;">Código de erro: SESSION_EXPIRED</p></div>';
        localStorage.removeItem(SESSION_KEY);
        return;
      }

      // Verifica se é o jogo correto
      if (session.gameId !== GAME_ID) {
        alert('⚠️ ERRO: Token inválido para este jogo.');
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:#fff;font-family:Arial,sans-serif;flex-direction:column;"><h1>🚫 Token Inválido</h1><p>Este jogo não corresponde à sessão atual.</p><p style="color:#666;font-size:12px;margin-top:20px;">Código de erro: INVALID_GAME</p></div>';
        return;
      }

      // Limpa o token após validação (uso único)
      localStorage.removeItem(SESSION_KEY);

      console.log('✅ Jogo autorizado pelo NeuroGame Launcher');
    } catch (error) {
      console.error('Erro na validação:', error);
      alert('⚠️ ERRO: Falha na validação do jogo.');
      document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:#fff;font-family:Arial,sans-serif;flex-direction:column;"><h1>❌ Erro de Validação</h1><p>Não foi possível validar o acesso ao jogo.</p><p style="color:#666;font-size:12px;margin-top:20px;">Código de erro: VALIDATION_ERROR</p></div>';
    }
  });

  // Previne abertura em nova aba/janela
  if (window.opener || window.parent !== window) {
    document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a1a;color:#fff;font-family:Arial,sans-serif;flex-direction:column;"><h1>🔒 Acesso Negado</h1><p>Este jogo deve ser aberto através do NeuroGame Launcher.</p><p style="color:#666;font-size:12px;margin-top:20px;">Código de erro: INVALID_CONTEXT</p></div>';
  }
})();
</script>
  `;
};
