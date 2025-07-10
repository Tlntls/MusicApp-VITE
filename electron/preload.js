const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded!');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Test function
  ping: () => ipcRenderer.invoke('ping'),
  
  // Fetch songs from the main process
  fetchSongs: () => ipcRenderer.invoke('fetchSongs'),
  
  // Open folder dialog
  openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
  
  // Add songs from folder
  addSongsFromFolder: (folderPath) => ipcRenderer.invoke('addSongsFromFolder', folderPath),
  
  // Log song played
  songPlayed: (song) => ipcRenderer.invoke('songPlayed', song),
  
  // Listen for scan progress updates
  onScanProgress: (callback) => {
    const subscription = (event, message) => callback(message);
    ipcRenderer.on('scanProgress', subscription);
    
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('scanProgress', subscription);
    };
  }
});

console.log('electronAPI exposed to renderer'); 