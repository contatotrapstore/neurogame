# NeuroGame Launcher - Quick Start Guide

## 🚀 Installation (5 minutes)

### Option 1: Automated (Recommended)

**Windows:**
```bash
install.bat
```

**Mac/Linux:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual
```bash
npm install
mkdir ../Jogos
```

## 📁 Required Folder Structure

```
NeuroGame/
├── neurogame-launcher/    ← You are here
└── Jogos/                 ← Games go here
    ├── game1/
    │   └── index.html
    └── game2/
        └── index.html
```

## 🎮 Running the Launcher

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 🔑 First Login

1. Start your backend API (must be running!)
2. Launch the app: `npm run dev`
3. Login with your credentials:
   - Username: `demo`
   - Password: `Demo@123456`

Default API: `http://localhost:3000/api/v1` (configur�vel via `.env` ou ajustes internos)

## 🎲 Adding Games

### Step 1: Create Game Folder
```bash
mkdir ../Jogos/my-game
```

### Step 2: Add index.html
```html
<!-- ../Jogos/my-game/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My Game</title>
</head>
<body>
    <h1>Hello from My Game!</h1>
</body>
</html>
```

### Step 3: Add to Backend Database
```json
{
  "title": "My Game",
  "description": "A cool game",
  "folder_path": "my-game",
  "category": "Puzzle"
}
```

### Step 4: Refresh Library
- Press `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac)
- Or restart the launcher

## 📋 Essential Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development |
| `npm run build` | Build for production |
| `npm run build:win` | Build Windows app |
| `npm run build:mac` | Build macOS app |
| `npm run build:linux` | Build Linux app |

## 🔧 Configuration

### Change API URL
Defina `VITE_API_URL` no `.env` ou utilize o painel de configura��es do launcher.

### Change Window Size
Edit `main.js`:
```javascript
width: 1280,  // Change width
height: 720,  // Change height
```

## 🐛 Troubleshooting

### Can't connect to backend
```bash
# Check if backend is running
curl http://localhost:3000/api/v1/health

# Or navigate to:
http://localhost:3000/api/v1/health
```

### Game won't load
1. Check folder exists: `ls ../Jogos/game-folder`
2. Check index.html exists: `ls ../Jogos/game-folder/index.html`
3. Check folder_path in database matches folder name

### WebView blank screen
- Open DevTools: `Ctrl+Shift+I`
- Check console for errors
- Verify game HTML is valid

### Can't login
1. Verify backend is running
2. Check API URL in storage.js
3. Verify credentials are correct
4. Check backend logs for errors

## 🔐 Security Checklist

- ✅ Backend must validate JWT tokens
- ✅ Games run in sandboxed WebView
- ✅ No external URLs allowed
- ✅ Tokens stored securely
- ✅ HTTPS for production

## 📦 Distribution

### Windows
Output: `dist-electron/NeuroGame Launcher Setup.exe`
- Double-click to install
- Or use portable version

### macOS
Output: `dist-electron/NeuroGame Launcher.dmg`
- Open DMG
- Drag to Applications

### Linux
Output: `dist-electron/NeuroGame Launcher.AppImage`
- Make executable: `chmod +x NeuroGame*.AppImage`
- Run: `./NeuroGame*.AppImage`

## 🎯 Quick Test

### 1. Test Backend Connection
```javascript
// In browser console
fetch('http://localhost:3000/api/v1/health')
  .then(r => r.json())
  .then(console.log)
```

### 2. Create Test Game
```bash
mkdir ../Jogos/test
cat > ../Jogos/test/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <h1>It Works!</h1>
  <button onclick="alert('Success!')">Click Me</button>
</body>
</html>
EOF
```

### 3. Add to Database
Use your backend admin panel or API:
```bash
curl -X POST http://localhost:3000/api/v1/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Game",
    "folder_path": "test",
    "description": "Test"
  }'
```

## 📚 Documentation Files

- `README.md` - Overview
- `SETUP.md` - Detailed setup
- `FILE_STRUCTURE.md` - Complete file reference
- `QUICK_START.md` - This file

## 🆘 Getting Help

### Check Logs
**Windows:** `%APPDATA%\neurogame-launcher\logs`
**Mac:** `~/Library/Logs/neurogame-launcher`
**Linux:** `~/.config/neurogame-launcher/logs`

### Debug Mode
```bash
# Set environment variable
export NODE_ENV=development
npm run dev
```

### Clear All Data
```javascript
// In DevTools console
await window.electronAPI.store.clear()
// Then reload app
```

## ✅ Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Jogos folder created (`../Jogos/`)
- [ ] Backend API running
- [ ] Can login successfully
- [ ] Games visible in library
- [ ] Can play games
- [ ] Build completes successfully

## 🚀 Next Steps

1. ✅ Complete installation
2. ✅ Test with sample game
3. ✅ Add your games
4. ✅ Test all features
5. ✅ Build for production
6. ✅ Deploy to users

---

**Need more help?** Read `SETUP.md` for detailed instructions.
