const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store');

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
    autoHideMenuBar: !isDev,
    frame: true
  });

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Create menu
  createMenu();

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
    store.set(key, value);
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

  // Auto-updater placeholder
  ipcMain.handle('check-for-updates', async () => {
    // TODO: Implement auto-updater with electron-updater
    return {
      available: false,
      version: app.getVersion()
    };
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Initialize store after app is ready
  store = new Store();

  // Check if running in development mode
  isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  registerIpcHandlers();
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
