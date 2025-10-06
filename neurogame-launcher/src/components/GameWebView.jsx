import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, IconButton, Tooltip, Alert } from '@mui/material';
import { Close, Fullscreen, FullscreenExit } from '@mui/icons-material';

function GameWebView({ gamePath, onExit }) {
  const webviewRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState('');

  const applyViewportFixes = useCallback((webview) => {
    if (!webview) {
      return;
    }

    try {
      if (typeof webview.setZoomFactor === 'function') {
        webview.setZoomFactor(1);
      }
    } catch (zoomError) {
      console.warn('[GameWebView] Failed to set zoom factor:', zoomError);
    }

    const injectedCss = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        background: #000 !important;
      }

      canvas, iframe, object, embed,
      #gameContainer, #game-container, #unityContainer,
      #canvas, #game, #wrapper {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
      }
    `;

    const viewportScript = `
      (() => {
        const ensureMetaViewport = () => {
          if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            document.head.appendChild(meta);
          }
        };

        const stretch = () => {
          document.documentElement.style.width = '100%';
          document.documentElement.style.height = '100%';
          document.body.style.width = '100%';
          document.body.style.height = '100%';
          document.body.style.margin = '0';
          document.body.style.padding = '0';
        };

        const expandTargets = () => {
          const nodes = document.querySelectorAll('canvas, #game, #unityContainer, #canvas, #gameContainer');
          nodes.forEach((node) => {
            node.style.width = '100%';
            node.style.height = '100%';
            node.style.maxWidth = 'none';
            node.style.maxHeight = 'none';
          });
        };

        // Listener para ESC dentro do jogo
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' || e.keyCode === 27) {
            e.preventDefault();
            e.stopPropagation();
            // Envia mensagem para o launcher
            if (window.electronAPI) {
              window.electronAPI.exitGame();
            }
          }
        }, true); // useCapture=true para capturar antes do jogo

        ensureMetaViewport();
        stretch();
        expandTargets();

        if (typeof ResizeObserver === 'function') {
          const observer = new ResizeObserver(() => {
            stretch();
            expandTargets();
          });
          observer.observe(document.body);
        }
      })();
    `;

    if (typeof webview.insertCSS === 'function') {
      webview.insertCSS(injectedCss).catch(() => {});
    }

    if (typeof webview.executeJavaScript === 'function') {
      webview.executeJavaScript(viewportScript, false).catch(() => {});
    }
  }, []);
  useEffect(() => {
    const webview = webviewRef.current;

    if (!webview) {
      return undefined;
    }

    const handleFailLoad = (event) => {
      console.error('Webview failed to load:', event);
      setError(`Failed to load game: ${event.errorDescription}`);
    };

    const handleStartLoading = () => {
      setError('');
    };

    const handleConsoleMessage = (event) => {
      console.log(`Game console [${event.level}]:`, event.message);
    };

    const handleDomReady = () => {
      applyViewportFixes(webview);
    };

    const handleKeyDown = (event) => {
      // ESC para sair do jogo
      if (event.key === 'Escape') {
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        handleExit();
      }
      // F11 para toggle fullscreen
      if (event.key === 'F11') {
        event.preventDefault();
        handleFullscreenToggle();
      }
    };

    webview.addEventListener('did-fail-load', handleFailLoad);
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('console-message', handleConsoleMessage);
    webview.addEventListener('dom-ready', handleDomReady);
    document.addEventListener('keydown', handleKeyDown);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      webview.removeEventListener('did-fail-load', handleFailLoad);
      webview.removeEventListener('did-start-loading', handleStartLoading);
      webview.removeEventListener('console-message', handleConsoleMessage);
      webview.removeEventListener('dom-ready', handleDomReady);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [applyViewportFixes, gamePath]);


  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      webviewRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onExit();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'black',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Controls overlay - SEMPRE visível */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Sair do Jogo (ESC)">
            <IconButton
              onClick={handleExit}
              sx={{
                color: 'white',
                bgcolor: 'rgba(220,38,38,0.9)',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'rgba(220,38,38,1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s'
              }}
            >
              <Close sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title={isFullscreen ? 'Sair Fullscreen (F11)' : 'Fullscreen (F11)'}>
          <IconButton
            onClick={handleFullscreenToggle}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.9)',
              width: 56,
              height: 56,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s'
            }}
          >
            {isFullscreen ? <FullscreenExit sx={{ fontSize: 28 }} /> : <Fullscreen sx={{ fontSize: 28 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error message */}
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            width: '80%',
            maxWidth: 600
          }}
        >
          <Alert severity="error" onClose={handleExit}>
            {error}
          </Alert>
        </Box>
      )}

      {/* WebView for game - usando display inline-flex conforme docs Electron */}
      <webview
        ref={webviewRef}
        src={gamePath}
        style={{
          display: error ? 'none' : 'inline-flex',
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1
        }}
        webpreferences="contextIsolation=yes, autoplayPolicy=no-user-gesture-required, nodeIntegration=no"
      />
    </Box>
  );
}

export default GameWebView;
