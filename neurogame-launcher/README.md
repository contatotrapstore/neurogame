# NeuroGame Launcher

Desktop application for managing and playing NeuroGame library games.

## Features

- **User Authentication**: Secure login with persistent sessions
- **Game Library**: Browse and search your game collection
- **Game Player**: Play games directly in the launcher using WebView
- **Offline Support**: Graceful handling of network issues
- **Auto-Updates**: Built-in update mechanism (placeholder)
- **Cross-Platform**: Build for Windows, macOS, and Linux

## Tech Stack

- **Electron**: Desktop application framework
- **React**: UI framework
- **Material-UI**: Component library
- **Vite**: Build tool
- **Axios**: HTTP client

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your games folder structure:
```
NeuroGame/
├── neurogame-launcher/
└── Jogos/
    ├── game-folder-1/
    │   └── index.html
    ├── game-folder-2/
    │   └── index.html
    └── ...
```

## Development

Run the app in development mode:

```bash
npm run dev
```

This will start both the React dev server and Electron.

## Building

Build for your current platform:

```bash
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

Build for all platforms:

```bash
npm run build:all
```

Executables will be in the `dist-electron` folder.

## Configuration

The launcher connects to the backend API. Default URL is `http://localhost:3000/api/v1`.

### API Endpoints Used

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/auth/validate` - Token validation
- `GET /api/v1/games/my-games` - Fetch user's game library
- `GET /api/v1/games/:id` - Get game details
- `GET /api/v1/games/:id/validate` - Validate game access

## Game Requirements

Each game should be a self-contained folder with:

- `index.html` - Entry point
- All assets (images, sounds, scripts) in the same folder
- No external dependencies (or properly bundled)

## Security

- Context isolation enabled
- Node integration disabled in renderer
- Content Security Policy enforced
- Secure IPC communication via preload script
- Navigation and window opening restricted

## Storage

The launcher uses `electron-store` for local data persistence:

- Authentication tokens
- User information
- Application settings

Data is stored in the OS-specific user data directory.

## Troubleshooting

### Games won't load
- Verify the game folder exists in `../Jogos/[folder_path]/`
- Check that `index.html` exists in the game folder
- Check DevTools console for errors

### Can't connect to backend
- Verify backend is running
- Check API URL in settings
- Verify network connection

### Authentication issues
- Clear stored data (Help > Reset Settings)
- Re-login with correct credentials
- Check backend logs

## License

MIT
