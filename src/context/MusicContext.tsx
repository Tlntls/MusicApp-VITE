// src/context/MusicContext.tsx

'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Song } from '../lib/types';

// Add Electron API type definitions
declare global {
  interface Window {
    electronAPI?: {
      fetchSongs: () => Promise<any[]>;
      openFolderDialog: () => Promise<string | undefined>;
      addSongsFromFolder: (path: string) => void;
      onScanProgress: (callback: (message: string) => void) => () => void;
      fetchFolders: () => Promise<string[]>;
      removeFolder: (folder: string) => Promise<void>;
    };
  }
}



type MusicContextType = {
  songs: Song[];
  isLoading: boolean;
  fetchSongs: () => Promise<void>;
  scanLog: string[];
  startFolderScan: () => Promise<void>;
  folders: string[];
  fetchFolders: () => Promise<void>;
  removeFolder: (folder: string) => Promise<void>;
  rescanFolder: (folder: string) => Promise<void>;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// This is a check to see if we are inside an Electron environment
const isElectron = typeof window !== 'undefined' && window.electronAPI;

export function MusicProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    console.log("Context: fetchSongs called");
    console.log("Context: isElectron =", isElectron);
    console.log("Context: window.electronAPI =", window.electronAPI);
    
    if (!isElectron || !window.electronAPI) {
      const msg = "Not in Electron, skipping fetch.";
      console.log(msg);
      setError(msg);
      setIsLoading(false);
      return;
    }
    console.log("Context: Fetching songs...");
    setIsLoading(true);
    try {
      const fetchedSongs = await window.electronAPI!.fetchSongs();
      console.log("Context: IPC fetchSongs returned:", fetchedSongs);
      // Normalize songs to ensure correct structure
      const normalizedSongs = fetchedSongs.map((song: any) => {
        // If already normalized, return as is
        if (typeof song.artist === 'object' && typeof song.album === 'object') return song;
        // Otherwise, convert
        return {
          ...song,
          artist: typeof song.artist === 'object' ? song.artist : { id: song.artist?.toLowerCase?.().replace(/\s+/g, '-') || song.artist || 'unknown', name: song.artist || 'Unknown Artist' },
          album: typeof song.album === 'object' ? song.album : { id: song.album?.toLowerCase?.().replace(/\s+/g, '-') || song.album || 'unknown', title: song.album || 'Unknown Album', cover: song.coverArtPath || song.cover || '/placeholder-cover.png' },
        };
      });
      setSongs(normalizedSongs);
      setError(null);
      console.log("Context: Songs updated.", normalizedSongs);
    } catch (error) {
      setError("Error fetching songs: " + (error instanceof Error ? error.message : String(error)));
      console.error("Context: Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFolders = async () => {
    console.log("Context: fetchFolders called");
    if (!isElectron || !window.electronAPI) {
      console.log("Context: Not in Electron, skipping fetchFolders.");
      return;
    }
    try {
      const fetchedFolders = await (window.electronAPI as any).fetchFolders();
      console.log("Context: IPC fetchFolders returned:", fetchedFolders);
      setFolders(fetchedFolders);
      console.log("Context: Folders updated.", fetchedFolders);
    } catch (error) {
      setFolders([]);
      console.error("Context: Error fetching folders:", error);
    }
  };

  const removeFolder = async (folder: string) => {
    if (!isElectron || !window.electronAPI) return;
    await (window.electronAPI as any).removeFolder(folder);
    await fetchSongs();
    await fetchFolders();
  };

  const rescanFolder = async (folder: string) => {
    if (!isElectron || !window.electronAPI) return;
    await (window.electronAPI as any).addSongsFromFolder(folder);
    await fetchSongs();
    await fetchFolders();
  };

  const startFolderScan = async () => {
    console.log("Context: startFolderScan called");
    if (!isElectron || !window.electronAPI) {
      const msg = "This feature is only available in the desktop app.";
      setError(msg);
      alert(msg);
      return;
    }
    setError(null);
    console.log("Context: Electron API available, opening folder dialog...");
    setScanLog(prev => [...prev, "Scan initiated..."]);
    try {
      const folderPath = await window.electronAPI!.openFolderDialog();
      console.log("Context: Folder path selected:", folderPath);
      if (folderPath) {
        console.log("Context: Starting folder scan for:", folderPath);
        window.electronAPI!.addSongsFromFolder(folderPath);
      } else {
        console.log("Context: Folder selection canceled");
        setScanLog(prev => [...prev, "Folder selection canceled."]);
      }
    } catch (error) {
      setError("Error in startFolderScan: " + (error instanceof Error ? error.message : String(error)));
      console.error("Context: Error in startFolderScan:", error);
      setScanLog(prev => [...prev, `Error: ${(error as Error).message}`]);
    }
  };

  React.useEffect(() => {
    if (isElectron && window.electronAPI) {
      const cleanup = window.electronAPI!.onScanProgress((logMessage: string) => {
        setScanLog(prevLogs => [...prevLogs, logMessage]);
        if (logMessage.includes('--- Scan Complete! ---')) {
          fetchSongs();
          fetchFolders();
        }
      });
      fetchSongs();
      fetchFolders();
      return () => cleanup();
    } else {
      setIsLoading(false);
      setError("Electron APIs not available. App is running in browser mode or preload script failed.");
    }
  }, []);

  return (
    <MusicContext.Provider value={{ songs, isLoading, fetchSongs, scanLog, startFolderScan, folders, fetchFolders, removeFolder, rescanFolder }}>
      {error && (
        <div style={{ background: 'red', color: 'white', padding: 8, fontWeight: 'bold', zIndex: 9999 }}>
          {error}
        </div>
      )}
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}