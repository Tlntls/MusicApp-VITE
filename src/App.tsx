import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import Songs from './pages/Songs';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Audiobooks from './pages/Audiobooks';
import AudiobookDetail from './pages/AudiobookDetail';
import Search from './pages/Search';
import AppShell from './components/app-shell';
import { MusicProvider } from './context/MusicContext';
import { PlayerProvider } from './hooks/use-player-store';

export default function App() {
  // Remove all debug logs and banners
  // Test the ping function if available
  React.useEffect(() => {
    const api = window.electronAPI as any;
    if (api?.ping) {
      api.ping().then((result: any) => {
        // Optionally keep this log if you want to test ping
        // console.log('Ping result:', result);
      }).catch((error: any) => {
        // console.error('Ping error:', error);
      });
    }
  }, []);

  return (
    <PlayerProvider key="player">
      <MusicProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path="artists" element={<Artists />} />
              <Route path="artists/:id" element={<ArtistDetail />} />
              <Route path="albums" element={<Albums />} />
              <Route path="album/:id" element={<AlbumDetail />} />
              <Route path="songs" element={<Songs />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="playlists/:id" element={<PlaylistDetail />} />
              <Route path="audiobooks" element={<Audiobooks />} />
              <Route path="audiobooks/:id" element={<AudiobookDetail />} />
              <Route path="search" element={<Search />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </MusicProvider>
    </PlayerProvider>
  );
} 