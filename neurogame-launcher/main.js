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
const fs = require('fs');
const crypto = require('crypto');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');
const { download } = require('electron-dl');

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
    show: false // Não mostrar até estar pronto
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
        if (process.env.OPEN_DEVTOOLS === '1') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (!isDev) {
      mainWindow.maximize();
    }
  });

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

  ipcMain.handle('download-game', async (event, payload) => {
    const { url, fileName, directory, checksum } = payload;

    if (!url) {
      return {
        success: false,
        message: 'URL de download não informada'
      };
    }

    const win = BrowserWindow.fromWebContents(event.sender);
    const targetDirectory = directory || path.join(app.getPath('userData'), 'games');

    try {
      await fs.promises.mkdir(targetDirectory, { recursive: true });
    } catch (mkdirError) {
      console.error('[download] Failed to prepare directory:', mkdirError);
      return {
        success: false,
        message: 'Não foi possível preparar a pasta de jogos'
      };
    }

    try {
      const downloadResult = await download(win, url, {
        directory: targetDirectory,
        filename: fileName || undefined,
        overwrite: true,
        onProgress: (progress) => {
          event.sender.send('game-download-progress', {
            url,
            percent: progress.percent,
            transferredBytes: progress.transferredBytes,
            totalBytes: progress.totalBytes
          });
        }
      });

      const filePath = downloadResult.getSavePath();
      let checksumValid = true;

      if (checksum) {
        try {
          checksumValid = await new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);

            stream.on('data', (chunk) => hash.update(chunk));
            stream.on('error', reject);
            stream.on('end', () => {
              const digest = hash.digest('hex');
              resolve(digest.toLowerCase() === checksum.toLowerCase());
            });
          });

          if (!checksumValid) {
            await fs.promises.unlink(filePath).catch(() => {});
            return {
              success: false,
              checksumValid,
              message: 'Arquivo baixado com checksum inválido'
            };
          }
        } catch (hashError) {
          console.error('[download] Failed to validate checksum:', hashError);
          return {
            success: false,
            message: 'Não foi possível validar o checksum do arquivo'
          };
        }
      }

      return {
        success: true,
        filePath,
        checksumValid,
        directory: targetDirectory
      };
    } catch (error) {
      console.error('[download] Failed to download game:', error);
      return {
        success: false,
        message: error.message || 'Falha ao baixar jogo'
      };
    }
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
  // Considera dev se NODE_ENV=development OU se existe pasta node_modules/electron
  const hasElectronDevFolder = fs.existsSync(path.join(__dirname, 'node_modules', 'electron'));
  isDev = process.env.NODE_ENV === 'development' || !app.isPackaged || hasElectronDevFolder;
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
