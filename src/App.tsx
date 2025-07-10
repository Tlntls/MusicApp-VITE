import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import Songs from './pages/Songs';
import Playlists from './pages/Playlists';
import Audiobooks from './pages/Audiobooks';
import AudiobookDetail from './pages/AudiobookDetail';
import Search from './pages/Search';
import AppShell from './components/app-shell';
import { MusicProvider } from './context/MusicContext';
import { PlayerProvider } from './hooks/use-player-store';

export default function App() {
  console.log('App component loaded');
  console.log('window.electronAPI:', window.electronAPI);
  
  // Test the ping function if available
  React.useEffect(() => {
    const api = window.electronAPI as any;
    if (api?.ping) {
      console.log('Testing ping...');
      api.ping().then((result: any) => {
        console.log('Ping result:', result);
      }).catch((error: any) => {
        console.error('Ping error:', error);
      });
    }
  }, []);
  
  return (
    <PlayerProvider>
      <MusicProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:id" element={<ArtistDetail />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/audiobooks" element={<Audiobooks />} />
              <Route path="/audiobooks/:id" element={<AudiobookDetail />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </MusicProvider>
    </PlayerProvider>
  );
} 