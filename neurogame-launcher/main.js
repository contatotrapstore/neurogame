const electronModule = require('electron');

if (typeof electronModule === 'string' || !process.versions?.electron) {
  // Relaunch Electron if the environment forced Node mode
  const { spawn } = require('child_process');
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;

  const child = spawn(electronModule, process.argv.slice(1), {
    stdio: 'inherit',
    env
  });

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });
  return;
}

const { app, BrowserWindow, ipcMain, Menu, dialog } = electronModule;
const path = require('path');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');

let store;
let mainWindow;
let isDev;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'build/icon.png'),
    autoHideMenuBar: true,
    frame: true,
    fullscreen: !isDev
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    // Ensure fullscreen is set after window is ready
    mainWindow.once('ready-to-show', () => {
      mainWindow.setFullScreen(true);
    });
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`[main] Failed to load ${validatedURL}: ${errorCode} ${errorDescription}`);
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[renderer] ${message} (${sourceId}:${line})`);
  });

  // Remove menu completely
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh Library',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('refresh-library');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About NeuroGame',
          click: () => {
            mainWindow.webContents.send('show-about');
          }
        }
      ]
    }
  ];

  if (isDev) {
    template[1].submenu.push(
      { type: 'separator' },
      { role: 'toggleDevTools' }
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function registerIpcHandlers() {
  // IPC Handlers
  ipcMain.handle('store-get', (event, key) => {
    return store.get(key);
  });

  ipcMain.handle('store-set', (event, key, value) => {
    if (value === null || value === undefined) {
      store.delete(key);
    } else {
      store.set(key, value);
    }
    return true;
  });

  ipcMain.handle('store-delete', (event, key) => {
    store.delete(key);
    return true;
  });

  ipcMain.handle('store-clear', () => {
    store.clear();
    return true;
  });

  ipcMain.handle('get-app-path', () => {
    return app.getAppPath();
  });

  ipcMain.handle('get-games-path', () => {
    const appPath = app.getAppPath();
    const gamesPath = isDev
      ? path.join(path.dirname(appPath), 'Jogos')
      : path.join(path.dirname(path.dirname(appPath)), 'Jogos');
    return gamesPath;
  });

  ipcMain.handle('get-user-data-path', () => {
    return app.getPath('userData');
  });

  // Auto-updater handlers
  ipcMain.handle('check-for-updates', async () => {
    if (isDev) {
      return {
        available: false,
        version: app.getVersion(),
        isDev: true
      };
    }

    try {
      const result = await autoUpdater.checkForUpdates();
      return {
        available: result.updateInfo.version !== app.getVersion(),
        version: app.getVersion(),
        latestVersion: result.updateInfo.version,
        isDev: false
      };
    } catch (error) {
      console.error('Error checking for updates:', error);
      return {
        available: false,
        version: app.getVersion(),
        error: error.message
      };
    }
  });

  ipcMain.handle('download-update', async () => {
    if (isDev) return { success: false, message: 'Updates disabled in dev mode' };

    try {
      await autoUpdater.downloadUpdate();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('install-update', () => {
    if (isDev) return;
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });
}

function setupAutoUpdater() {
  if (isDev) {
    console.log('[updater] Auto-updater disabled in development mode');
    return;
  }

  // Configure auto-updater
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    console.log('[updater] Checking for updates...');
    mainWindow?.webContents.send('update-status', { status: 'checking' });
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[updater] Update available:', info.version);
    mainWindow?.webContents.send('update-status', {
      status: 'available',
      version: info.version,
      releaseNotes: info.releaseNotes
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('[updater] Update not available');
    mainWindow?.webContents.send('update-status', { status: 'not-available' });
  });

  autoUpdater.on('error', (err) => {
    console.error('[updater] Error:', err);
    mainWindow?.webContents.send('update-status', {
      status: 'error',
      error: err.message
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`[updater] Download progress: ${progressObj.percent}%`);
    mainWindow?.webContents.send('update-status', {
      status: 'downloading',
      progress: progressObj.percent
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('[updater] Update downloaded');
    mainWindow?.webContents.send('update-status', {
      status: 'downloaded',
      version: info.version
    });

    // Show dialog to install
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização Disponível',
      message: `Uma nova versão (${info.version}) foi baixada.`,
      detail: 'O launcher será reiniciado para aplicar a atualização.',
      buttons: ['Instalar Agora', 'Instalar Depois']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Check for updates on startup (after 5 seconds)
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(err => {
      console.error('[updater] Failed to check for updates:', err);
    });
  }, 5000);
}

// App lifecycle
app.whenReady().then(() => {
  // Initialize store after app is ready
  store = new Store();

  // Check if running in development mode
  isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  console.log(`[launcher] isDev: ${isDev} | NODE_ENV: ${process.env.NODE_ENV} | isPackaged: ${app.isPackaged}`);

  registerIpcHandlers();
  createWindow();
  setupAutoUpdater();

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

// Security
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // Allow navigation to localhost in dev mode
    if (isDev && parsedUrl.hostname === 'localhost') {
      return;
    }

    // Allow navigation to game files
    if (parsedUrl.protocol === 'file:') {
      return;
    }

    // Block all other navigation
    event.preventDefault();
  });

  contents.setWindowOpenHandler(({ url }) => {
    // Block opening new windows
    return { action: 'deny' };
  });
});

