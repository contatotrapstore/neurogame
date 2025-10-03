const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Store operations
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear')
  },

  // Path operations
  paths: {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    getGamesPath: () => ipcRenderer.invoke('get-games-path'),
    getUserDataPath: () => ipcRenderer.invoke('get-user-data-path')
  },

  // Update operations
  updates: {
    check: () => ipcRenderer.invoke('check-for-updates')
  },

  // Event listeners
  on: (channel, callback) => {
    const validChannels = ['refresh-library', 'show-about'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  removeListener: (channel, callback) => {
    const validChannels = ['refresh-library', 'show-about'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeListener(channel, callback);
    }
  }
});
