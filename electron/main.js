const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const mm = require('music-metadata');
const crypto = require('crypto');

const SUPPORTED_EXTENSIONS = ['.mp3', '.flac', '.wav', '.ogg', '.m4a'];
const DB_PATH = path.join(app.getPath('userData'), 'music-db.json');
const COVER_DIR = path.join(app.getPath('userData'), 'covers');

let mainWindow;

function createWindow() {
  console.log('Creating Electron window...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Loading from Vite dev server...');
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Loading from built files...');
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function hashPath(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

function scanFolderForAudioFiles(folderPath) {
  let files = [];
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanFolderForAudioFiles(fullPath));
    } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function saveLibrary(db) {
  console.log('Saving library to', DB_PATH);
  console.log('Library data:', db);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

function loadLibrary() {
  if (fs.existsSync(DB_PATH)) {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    console.log('Loaded library from', DB_PATH, 'data:', data);
    return data;
  }
  console.log('No library found at', DB_PATH);
  return { folders: [], songs: [] };
}

function cleanUnusedCovers(songs) {
  if (!fs.existsSync(COVER_DIR)) return;
  const usedCovers = new Set(songs.map(s => s.album.cover).filter(Boolean));
  const allCovers = fs.readdirSync(COVER_DIR).map(f => path.join(COVER_DIR, f));
  for (const file of allCovers) {
    if (!usedCovers.has(file)) {
      try { fs.unlinkSync(file); } catch {}
    }
  }
}

// IPC: Fetch songs from DB
ipcMain.handle('fetchSongs', async () => {
  try {
    const db = loadLibrary();
    console.log('IPC fetchSongs returning', db.songs.length, 'songs');
    return db.songs;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
});

// IPC: Fetch watched folders
ipcMain.handle('fetchFolders', async () => {
  try {
    const db = loadLibrary();
    console.log('IPC fetchFolders returning', db.folders.length, 'folders:', db.folders);
    return db.folders;
  } catch (error) {
    return [];
  }
});

// IPC: Open folder dialog
ipcMain.handle('openFolderDialog', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Music Folder'
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return undefined;
  } catch (error) {
    console.error('Error opening folder dialog:', error);
    return undefined;
  }
});

// IPC: Add folder (scan, merge, update DB)
ipcMain.handle('addSongsFromFolder', async (event, folderPath) => {
  try {
    if (!fs.existsSync(COVER_DIR)) fs.mkdirSync(COVER_DIR, { recursive: true });
    mainWindow.webContents.send('scanProgress', `Scanning folder: ${folderPath}`);
    const audioFiles = scanFolderForAudioFiles(folderPath);
    mainWindow.webContents.send('scanProgress', `Found ${audioFiles.length} audio files`);
    const db = loadLibrary();
    const newSongs = [];
    for (const file of audioFiles) {
      try {
        const metadata = await mm.parseFile(file, { duration: true });
        const title = metadata.common.title || path.basename(file);
        const artistName = metadata.common.artist || 'Unknown Artist';
        const albumTitle = metadata.common.album || 'Unknown Album';
        const duration = metadata.format.duration || 0;
        let cover = '';
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const coverFile = path.join(COVER_DIR, hashPath(file) + '.png');
          fs.writeFileSync(coverFile, metadata.common.picture[0].data);
          cover = coverFile;
        }
        const song = {
          id: hashPath(file),
          title,
          artist: { id: hashPath(artistName), name: artistName },
          album: { id: hashPath(albumTitle), title: albumTitle, cover },
          duration: Math.round(duration),
          src: file,
          folder: folderPath
        };
        newSongs.push(song);
      } catch (err) {
        mainWindow.webContents.send('scanProgress', `Error reading file: ${file}`);
        console.error('Error reading file:', file, err);
      }
    }
    // Merge: Remove old songs from this folder, add new ones
    const mergedSongs = db.songs.filter(s => s.folder !== folderPath).concat(newSongs);
    // Add folder if not present
    const folders = db.folders.includes(folderPath) ? db.folders : db.folders.concat([folderPath]);
    const newDb = { folders, songs: mergedSongs };
    console.log('addSongsFromFolder: saving newDb', newDb);
    saveLibrary(newDb);
    cleanUnusedCovers(newDb.songs);
    mainWindow.webContents.send('scanProgress', '--- Scan Complete! ---');
    return true;
  } catch (error) {
    console.error('Error adding songs from folder:', error);
    return false;
  }
});

// IPC: Remove folder (and all its songs)
ipcMain.handle('removeFolder', async (event, folderPath) => {
  try {
    const db = loadLibrary();
    const folders = db.folders.filter(f => f !== folderPath);
    const songs = db.songs.filter(s => s.folder !== folderPath);
    const newDb = { folders, songs };
    saveLibrary(newDb);
    cleanUnusedCovers(newDb.songs);
    return true;
  } catch (error) {
    console.error('Error removing folder:', error);
    return false;
  }
});

ipcMain.handle('songPlayed', async (event, song) => {
  try {
    console.log('Song played:', song.title);
    return true;
  } catch (error) {
    console.error('Error logging song play:', error);
    return false;
  }
});

ipcMain.handle('ping', async () => {
  console.log('Ping received from renderer!');
  return 'pong';
}); 