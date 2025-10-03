# NeuroGame Launcher Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Folder Structure

Ensure your project structure looks like this:

```
NeuroGame/
├── neurogame-launcher/          # This launcher app
│   ├── src/
│   ├── main.js
│   ├── preload.js
│   ├── package.json
│   └── ...
├── Jogos/                       # Games folder (must exist)
│   ├── memory-game/
│   │   └── index.html
│   ├── puzzle-game/
│   │   └── index.html
│   └── ...
└── backend/                     # Your backend API (optional for dev)
```

### 3. Backend Requirements

Make sure your backend API is running and provides these endpoints:

- `POST /api/v1/auth/login` - Login with email/password
- `GET /api/v1/auth/validate` - Validate auth token
- `GET /api/v1/games/my-games` - Get user's games
- `GET /api/v1/games/:id` - Get game details
- `GET /api/v1/games/:id/validate` - Validate game access

### 4. Run Development Mode

```bash
npm run dev
```

This starts:
- Vite dev server on http://localhost:5173
- Electron app that loads the dev server

### 5. Build for Production

**Windows:**
```bash
npm run build:win
```

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

Output will be in `dist-electron/` folder.

## Configuration

### API URL

By default, the launcher connects to `http://localhost:3000/api/v1`.

To change this, modify `src/services/storage.js`:

```javascript
return {
  apiUrl: 'http://your-api-url/api/v1'
};
```

### Game Path Resolution

Games are loaded from `../Jogos/[folder_path]/index.html` relative to the app.

The path resolution:
- **Development**: `[parent-of-launcher]/Jogos/`
- **Production**: `[parent-of-app]/Jogos/`

## Testing

### 1. Test Login

Default test credentials (configure in your backend):
```
Email: test@neurogame.com
Password: test123
```

### 2. Test Game

Create a simple test game:

```bash
mkdir -p ../Jogos/test-game
```

Create `../Jogos/test-game/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Game</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: Arial, sans-serif;
            color: white;
        }
        .game {
            text-align: center;
        }
        button {
            padding: 15px 30px;
            font-size: 18px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="game">
        <h1>Test Game</h1>
        <p>Score: <span id="score">0</span></p>
        <button onclick="incrementScore()">Click Me!</button>
    </div>
    <script>
        let score = 0;
        function incrementScore() {
            score++;
            document.getElementById('score').innerText = score;
        }
    </script>
</body>
</html>
```

### 3. Add Game to Backend

Add this game to your backend database:

```json
{
  "title": "Test Game",
  "description": "A simple test game",
  "folder_path": "test-game",
  "category": "Test",
  "thumbnail_url": "https://via.placeholder.com/400x225"
}
```

## Troubleshooting

### Issue: Electron doesn't start
**Solution**: Make sure Vite dev server is running first. The script waits for port 5173.

### Issue: Can't connect to backend
**Solution**:
1. Verify backend is running
2. Check API URL in storage.js
3. Check CORS settings on backend

### Issue: Games don't load
**Solution**:
1. Verify `../Jogos/` folder exists
2. Check game folder name matches `folder_path` in database
3. Ensure `index.html` exists in game folder
4. Check browser console in DevTools

### Issue: WebView security errors
**Solution**: Games must be loaded from local `file://` protocol. External URLs are blocked for security.

### Issue: Build fails
**Solution**:
1. Run `npm run build` first
2. Make sure `dist/` folder is created
3. Check for icon files in `build/` folder (optional)

## Icon Setup (Optional)

For custom app icons:

1. Create `build/` folder in project root
2. Add icons:
   - `build/icon.ico` (Windows)
   - `build/icon.icns` (macOS)
   - `build/icon.png` (Linux, 512x512)

## Development Tips

### Open DevTools
- In development: Menu > View > Toggle Developer Tools
- Or press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)

### View Webview Console
The game console messages are logged to the main console with `[Game console]` prefix.

### Clear Stored Data
```javascript
// In DevTools console:
await window.electronAPI.store.clear()
```

### Refresh Library
- Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (macOS)
- Or use File > Refresh Library menu

## Production Deployment

### Windows
1. Build: `npm run build:win`
2. Installer: `dist-electron/NeuroGame Launcher Setup x.x.x.exe`
3. Portable: `dist-electron/NeuroGame Launcher x.x.x.exe`

### macOS
1. Build: `npm run build:mac`
2. DMG: `dist-electron/NeuroGame Launcher-x.x.x.dmg`
3. ZIP: `dist-electron/NeuroGame Launcher-x.x.x-mac.zip`

### Linux
1. Build: `npm run build:linux`
2. AppImage: `dist-electron/NeuroGame Launcher-x.x.x.AppImage`
3. DEB: `dist-electron/neurogame-launcher_x.x.x_amd64.deb`

## Security Notes

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ WebView sandboxed
- ✅ Navigation restricted
- ✅ CSP enforced
- ✅ Secure IPC communication

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create `../Jogos/` folder
3. ✅ Start backend API
4. ✅ Run launcher: `npm run dev`
5. ✅ Login with test credentials
6. ✅ Play test game
7. ✅ Build for production when ready
