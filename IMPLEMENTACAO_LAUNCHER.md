# Guia de Implementação - Launcher Desktop (Electron)

Este documento contém toda a implementação do launcher desktop para usuários finais.

## Estrutura de Arquivos

```
neurogame-launcher/
├── package.json
├── electron.js (main process)
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.jsx
    ├── components/
    │   ├── Login.jsx
    │   ├── GameLibrary.jsx
    │   ├── GameCard.jsx
    │   └── GamePlayer.jsx
    └── services/
        └── api.js
```

## package.json

```json
{
  "name": "neurogame-launcher",
  "version": "1.0.0",
  "description": "NeuroGame Desktop Launcher",
  "main": "electron.js",
  "scripts": {
    "start": "concurrently \"npm run react\" \"wait-on http://localhost:3002 && electron .\"",
    "react": "vite --port 3002",
    "build": "vite build",
    "electron": "electron .",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "build": {
    "appId": "com.neurogame.launcher",
    "productName": "NeuroGame",
    "files": [
      "dist/**/*",
      "electron.js",
      "package.json"
    ],
    "directories": {
      "buildResources": "assets",
      "output": "release"
    },
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": ["AppImage"],
      "icon": "assets/icon.png"
    }
  },
  "dependencies": {
    "electron-updater": "^6.1.7",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "electron": "^28.1.0",
    "electron-builder": "^24.9.1",
    "concurrently": "^8.2.2",
    "wait-on": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## electron.js (Main Process)

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/icon.png')
  });

  // Development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3002');
    mainWindow.webContents.openDevTools();
  } else {
    // Production
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Auto-updater
  if (!process.env.NODE_ENV === 'development') {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-version', () => {
  return app.getVersion();
});

// Auto-updater events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});
```

## src/services/api.js

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; // Ou URL de produção

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
};

export const games = {
  getUserGames: () => api.get('/games/user/games'),
  validateAccess: (gameId) => api.get(`/games/${gameId}/validate`)
};

export default api;
```

## src/App.jsx

```jsx
import { useState, useEffect } from 'react';
import Login from './components/Login';
import GameLibrary from './components/GameLibrary';
import GamePlayer from './components/GamePlayer';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentGame(null);
  };

  const handlePlayGame = (game) => {
    setCurrentGame(game);
  };

  const handleBackToLibrary = () => {
    setCurrentGame(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentGame) {
    return <GamePlayer game={currentGame} onBack={handleBackToLibrary} />;
  }

  return <GameLibrary user={user} onPlayGame={handlePlayGame} onLogout={handleLogout} />;
}

export default App;
```

## src/components/Login.jsx

```jsx
import { useState } from 'react';
import { auth } from '../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await auth.login({ username, password });
      const { user, token, refreshToken } = response.data.data;

      localStorage.setItem('refreshToken', refreshToken);
      onLogin(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo.png" alt="NeuroGame" className="logo" />
        <h1>NeuroGame</h1>
        <p>Faça login para acessar seus jogos</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

## src/components/GameLibrary.jsx

```jsx
import { useState, useEffect } from 'react';
import { games as gamesAPI } from '../services/api';
import GameCard from './GameCard';
import './GameLibrary.css';

export default function GameLibrary({ user, onPlayGame, onLogout }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGames();
    // Sync every 5 minutes
    const interval = setInterval(loadGames, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getUserGames();
      setGames(response.data.data.games || []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar jogos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando jogos...</p>
      </div>
    );
  }

  return (
    <div className="library-container">
      <header className="library-header">
        <div>
          <img src="/logo.png" alt="NeuroGame" className="header-logo" />
          <h1>NeuroGame</h1>
        </div>
        <div className="user-info">
          <span>{user.fullName || user.username}</span>
          <button onClick={onLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <main className="games-grid">
        {games.length === 0 ? (
          <div className="no-games">
            <p>Nenhum jogo disponível no momento</p>
            <p>Entre em contato com o administrador</p>
          </div>
        ) : (
          games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPlay={onPlayGame}
            />
          ))
        )}
      </main>
    </div>
  );
}
```

## src/components/GameCard.jsx

```jsx
import './GameCard.css';

export default function GameCard({ game, onPlay }) {
  const handlePlay = async () => {
    if (!game.hasAccess) {
      alert('Você não tem acesso a este jogo. Verifique sua assinatura.');
      return;
    }
    onPlay(game);
  };

  return (
    <div className={`game-card ${!game.hasAccess ? 'locked' : ''}`}>
      <div className="game-cover">
        <img
          src={game.coverImage || '/placeholder-game.png'}
          alt={game.name}
        />
        {!game.hasAccess && (
          <div className="locked-overlay">
            <span>🔒 Bloqueado</span>
          </div>
        )}
      </div>
      <div className="game-info">
        <h3>{game.name}</h3>
        <p>{game.category}</p>
        <button
          onClick={handlePlay}
          disabled={!game.hasAccess}
          className="play-button"
        >
          {game.hasAccess ? 'Jogar' : 'Bloqueado'}
        </button>
      </div>
    </div>
  );
}
```

## src/components/GamePlayer.jsx

```jsx
import { useEffect, useState } from 'react';
import { games as gamesAPI } from '../services/api';
import './GamePlayer.css';

export default function GamePlayer({ game, onBack }) {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    validateAccess();
  }, [game.id]);

  const validateAccess = async () => {
    try {
      const response = await gamesAPI.validateAccess(game.id);
      if (response.data.data.hasAccess) {
        setValidated(true);
      } else {
        setError('Acesso negado a este jogo');
        setTimeout(onBack, 3000);
      }
    } catch (err) {
      setError('Erro ao validar acesso');
      setTimeout(onBack, 3000);
    }
  };

  if (error) {
    return (
      <div className="player-container">
        <div className="error-screen">
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={onBack}>Voltar</button>
        </div>
      </div>
    );
  }

  if (!validated) {
    return (
      <div className="player-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Validando acesso...</p>
        </div>
      </div>
    );
  }

  const gameUrl = `http://localhost:3000/games/${game.folderPath}/index.html`;

  return (
    <div className="player-container">
      <div className="player-header">
        <button onClick={onBack} className="back-button">
          ← Voltar à Biblioteca
        </button>
        <h2>{game.name}</h2>
      </div>
      <webview
        src={gameUrl}
        className="game-webview"
        allowFullScreen
      />
    </div>
  );
}
```

## CSS Básico (src/App.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #fff;
}

#root {
  width: 100vw;
  height: 100vh;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Comandos para executar:

```bash
cd neurogame-launcher
npm install
npm start
```

## Build para distribuição:

```bash
npm run dist
```

Isso gerará executáveis para Windows (.exe), Mac (.dmg) e Linux (.AppImage).
