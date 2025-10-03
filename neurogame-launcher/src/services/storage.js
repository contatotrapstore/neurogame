// Wrapper for electron-store operations

export const setStoredToken = async (token) => {
  if (window.electronAPI) {
    await window.electronAPI.store.set('auth_token', token);
  }
};

export const getStoredToken = async () => {
  if (window.electronAPI) {
    return await window.electronAPI.store.get('auth_token');
  }
  return null;
};

export const removeToken = async () => {
  if (window.electronAPI) {
    await window.electronAPI.store.delete('auth_token');
  }
};

export const setStoredUser = async (user) => {
  if (window.electronAPI) {
    await window.electronAPI.store.set('user', user);
  }
};

export const getStoredUser = async () => {
  if (window.electronAPI) {
    return await window.electronAPI.store.get('user');
  }
  return null;
};

export const setStoredSettings = async (settings) => {
  if (window.electronAPI) {
    await window.electronAPI.store.set('settings', settings);
  }
};

export const getStoredSettings = async () => {
  if (window.electronAPI) {
    return await window.electronAPI.store.get('settings') || {
      apiUrl: 'http://localhost:3000/api/v1'
    };
  }
  return {
    apiUrl: 'http://localhost:3000/api/v1'
  };
};

export const clearAllStorage = async () => {
  if (window.electronAPI) {
    await window.electronAPI.store.clear();
  }
};

export const getGamesPath = async () => {
  if (window.electronAPI) {
    return await window.electronAPI.paths.getGamesPath();
  }
  return null;
};
