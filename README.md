# LoseAmp - Music Player

A modern music player built with React, Vite, and Electron.

## Development

### Browser Development
```bash
npm run dev
```
Runs the app in the browser at http://localhost:3000

### Electron Development
```bash
npm run electron-dev
```
Runs the app in Electron with hot reload (requires Vite dev server to be running)

### Build for Production
```bash
npm run build
```
Builds the app for production

### Package for Distribution
```bash
npm run dist
```
Builds and packages the app for distribution (creates installers)

## Features

- 🎵 Music library management
- 🎨 Modern UI with shadcn/ui components
- 🔍 Search functionality
- 📱 Responsive design
- 🎧 Audio playback controls
- 📁 Folder scanning (Electron only)
- 🎯 Playlist management

## Project Structure

```
src/
├── components/     # UI components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/           # Utilities and types
└── app/           # Global styles

electron/
├── main.js        # Main Electron process
├── preload.js     # Preload script
└── assets/        # App icons
```

## Electron Features

The app includes Electron-specific features:
- Folder scanning for music files
- Native file dialogs
- System integration
- Cross-platform packaging

## Building for Distribution

The app can be packaged for:
- Windows (NSIS installer)
- macOS (DMG)
- Linux (AppImage)

Run `npm run dist` to create distribution packages. 