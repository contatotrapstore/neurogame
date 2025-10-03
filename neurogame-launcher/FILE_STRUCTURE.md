# NeuroGame Launcher - File Structure

## Complete File List

### Root Configuration Files

```
neurogame-launcher/
├── package.json                 # NPM dependencies and build scripts
├── vite.config.js              # Vite build configuration
├── electron.vite.config.js     # Optional Electron-Vite config
├── main.js                     # Electron main process
├── preload.js                  # Electron preload script (IPC bridge)
├── index.html                  # HTML entry point
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
├── README.md                   # Project documentation
├── SETUP.md                    # Setup instructions
├── FILE_STRUCTURE.md           # This file
├── install.bat                 # Windows installation script
└── install.sh                  # Unix/Mac installation script
```

### Source Files (src/)

```
src/
├── main.jsx                    # React entry point
├── App.jsx                     # Main app component with routing
├── index.css                   # Global styles
│
├── pages/                      # Page components
│   ├── Login.jsx              # Login page
│   ├── GameLibrary.jsx        # Game library/grid view
│   └── GameDetail.jsx         # Game detail and launcher
│
├── components/                 # Reusable components
│   ├── Header.jsx             # Top navigation bar
│   ├── GameCard.jsx           # Game card for library
│   └── GameWebView.jsx        # WebView wrapper for games
│
├── services/                   # Service modules
│   ├── api.js                 # API client (Axios wrapper)
│   └── storage.js             # Local storage wrapper
│
└── utils/                      # Utility functions
    └── auth.js                # Authentication helpers
```

## File Descriptions

### Electron Files

#### `main.js` - Electron Main Process
- Creates application window (1280x720)
- Sets up menu bar
- Handles IPC communication
- Security configuration
- Auto-updater placeholder
- Path resolution for games folder

#### `preload.js` - Preload Script
- Secure bridge between main and renderer
- Exposes safe APIs to frontend:
  - Store operations (get/set/delete)
  - Path operations (games path, app path)
  - Update checks
  - Event listeners

#### `package.json` - Package Configuration
- Dependencies: Electron, React, MUI, Axios
- Scripts: dev, build, build:win/mac/linux
- electron-builder configuration for packaging

### React Frontend

#### `src/main.jsx` - React Entry
- ReactDOM setup
- Material-UI theme configuration
- Dark theme with purple/indigo colors
- Global CSS import

#### `src/App.jsx` - Main App
- React Router setup
- Authentication state management
- Protected route handling
- Layout structure

#### `src/index.css` - Global Styles
- CSS reset
- Custom scrollbar
- WebView styles
- Base typography

### Pages

#### `src/pages/Login.jsx`
- Login form with email/password
- API authentication
- Token storage
- Error handling
- Loading states

#### `src/pages/GameLibrary.jsx`
- Displays user's game collection
- Search functionality
- Category filtering
- Grid layout with GameCard components
- Refresh capability
- Offline handling

#### `src/pages/GameDetail.jsx`
- Game information display
- Play button with access validation
- Game metadata (title, description, controls)
- WebView launcher
- Back navigation

### Components

#### `src/components/Header.jsx`
- Top navigation bar
- User profile display
- Logout functionality
- Back to library button (on game pages)
- Refresh button

#### `src/components/GameCard.jsx`
- Game thumbnail
- Title and description
- Category chip
- Play button
- Click to view details

#### `src/components/GameWebView.jsx`
- WebView wrapper for game playback
- Fullscreen toggle
- Exit button
- Error handling
- Loading states

### Services

#### `src/services/api.js`
- Axios instance creation
- Request/response interceptors
- Auto token attachment
- Error handling
- Offline detection

#### `src/services/storage.js`
- electron-store wrapper
- Token storage (auth_token)
- User data storage
- Settings storage
- Games path resolution

### Utilities

#### `src/utils/auth.js`
- Authentication status check
- Token validation with backend
- Logout function
- Session management

## Build Output

### Development
- Vite dev server: `http://localhost:5173`
- Electron loads dev server

### Production
```
dist/                          # Vite build output
dist-electron/                 # Electron packaged apps
├── win-unpacked/             # Windows unpacked
├── mac/                      # macOS app
├── linux-unpacked/           # Linux unpacked
├── NeuroGame Launcher Setup.exe    # Windows installer
├── NeuroGame Launcher.exe          # Windows portable
├── NeuroGame Launcher.dmg          # macOS installer
└── NeuroGame Launcher.AppImage     # Linux AppImage
```

## Data Storage Locations

### Windows
```
C:\Users\[Username]\AppData\Roaming\neurogame-launcher\
├── config.json               # electron-store data
└── logs/                     # Application logs
```

### macOS
```
~/Library/Application Support/neurogame-launcher/
├── config.json
└── logs/
```

### Linux
```
~/.config/neurogame-launcher/
├── config.json
└── logs/
```

## Stored Data Structure

### config.json (electron-store)
```json
{
  "auth_token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  },
  "settings": {
    "apiUrl": "http://localhost:3000/api/v1"
  }
}
```

## Dependencies

### Production Dependencies
- `@emotion/react` - CSS-in-JS for MUI
- `@emotion/styled` - Styled components
- `@mui/icons-material` - Material icons
- `@mui/material` - Material-UI components
- `axios` - HTTP client
- `electron-store` - Persistent storage
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing

### Development Dependencies
- `@vitejs/plugin-react` - Vite React plugin
- `concurrently` - Run multiple commands
- `electron` - Desktop framework
- `electron-builder` - App packager
- `vite` - Build tool
- `wait-on` - Wait for server

## API Integration

### Endpoints Used
```
POST /api/v1/auth/login
  → Login with email/password
  → Returns: { token, user }

GET /api/v1/auth/validate
  → Validate auth token
  → Returns: { valid: boolean }

GET /api/v1/games/my-games
  → Get user's game library
  → Returns: { games: [...] }

GET /api/v1/games/:id
  → Get game details
  → Returns: { game: {...} }

GET /api/v1/games/:id/validate
  → Validate game access
  → Returns: { hasAccess: boolean }
```

### Expected Game Object
```json
{
  "id": "game-id",
  "title": "Game Title",
  "description": "Game description",
  "folder_path": "game-folder",
  "category": "Puzzle",
  "thumbnail_url": "https://...",
  "instructions": "How to play...",
  "controls": "Keyboard controls..."
}
```

## Security Features

### Electron Security
- ✅ `nodeIntegration: false`
- ✅ `contextIsolation: true`
- ✅ `webviewTag: true` (for games)
- ✅ Preload script for secure IPC
- ✅ CSP (Content Security Policy)
- ✅ Navigation restrictions
- ✅ Window opening blocked

### API Security
- ✅ JWT token authentication
- ✅ Token stored in electron-store (encrypted)
- ✅ Token auto-attached to requests
- ✅ 401 auto-redirect to login
- ✅ HTTPS upgrade for external URLs

### Game Isolation
- ✅ WebView sandboxing
- ✅ No node integration in games
- ✅ Local file access only
- ✅ No external navigation
- ✅ Console message logging

## Development Workflow

1. **Setup**: Run `install.bat` or `install.sh`
2. **Development**: `npm run dev`
3. **Testing**: Test with local backend
4. **Building**: `npm run build:win/mac/linux`
5. **Distribution**: Share files from `dist-electron/`

## Troubleshooting Reference

### Common Issues
1. Port 5173 in use → Close other Vite instances
2. Games won't load → Check `../Jogos/` folder exists
3. API connection fails → Verify backend URL in settings
4. WebView errors → Check file:// protocol in path
5. Build fails → Run `npm run build` first

### Debug Tools
- DevTools: `Ctrl+Shift+I` (Windows) / `Cmd+Opt+I` (Mac)
- Console logs: Check main process and renderer
- Network tab: Monitor API calls
- Storage: Inspect electron-store data

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create games folder: `../Jogos/`
3. ✅ Configure backend API
4. ✅ Run development: `npm run dev`
5. ✅ Build production: `npm run build:win`
