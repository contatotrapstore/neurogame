import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Tooltip, Alert } from '@mui/material';
import { Close, Fullscreen, FullscreenExit } from '@mui/icons-material';

function GameWebView({ gamePath, onExit }) {
  const webviewRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const webview = webviewRef.current;

    if (webview) {
      // Handle webview errors
      webview.addEventListener('did-fail-load', (e) => {
        console.error('Webview failed to load:', e);
        setError(`Failed to load game: ${e.errorDescription}`);
      });

      webview.addEventListener('did-start-loading', () => {
        setError('');
      });

      // Console messages from the game
      webview.addEventListener('console-message', (e) => {
        console.log(`Game console [${e.level}]:`, e.message);
      });
    }

    // Handle fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
        position: 'relative',
        width: '100%',
        height: '100vh',
        bgcolor: 'black'
      }}
    >
      {/* Controls overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          transition: 'opacity 0.3s',
          '&:hover': {
            opacity: 1
          },
          opacity: isFullscreen ? 0 : 1
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Exit Game">
            <IconButton
              onClick={handleExit}
              sx={{
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
          <IconButton
            onClick={handleFullscreenToggle}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
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

      {/* WebView for game */}
      <webview
        ref={webviewRef}
        src={gamePath}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: error ? 'none' : 'block'
        }}
        allowpopups="false"
        nodeintegration="false"
        webpreferences="contextIsolation=yes"
      />
    </Box>
  );
}

export default GameWebView;
