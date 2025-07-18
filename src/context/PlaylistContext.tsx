import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Playlist, Song } from '../lib/types';

interface PlaylistContextType {
  playlists: Playlist[];
  addPlaylist: (playlist: Playlist) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

const PLAYLISTS_KEY = 'musicapp2_playlists';

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const raw = localStorage.getItem(PLAYLISTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const addPlaylist = (playlist: Playlist) => {
    setPlaylists(prev => [...prev, playlist]);
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        // Avoid duplicates
        if (pl.songs.find(s => s.id === song.id)) return pl;
        return { ...pl, songs: [...pl.songs, song] };
      }
      return pl;
    }));
  };

  return (
    <PlaylistContext.Provider value={{ playlists, addPlaylist, addSongToPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error('usePlaylists must be used within a PlaylistProvider');
  return ctx;
} 