import { getRecentlyPlayedAlbums } from '../hooks/use-player-store';
import { Link } from 'react-router-dom';
import React from 'react';

export default function Home() {
  const [albums, setAlbums] = React.useState(() => getRecentlyPlayedAlbums(10));

  React.useEffect(() => {
    const updateAlbums = () => setAlbums(getRecentlyPlayedAlbums(10));
    window.addEventListener('focus', updateAlbums);
    // Optionally, update on storage events (if another tab updates localStorage)
    window.addEventListener('storage', updateAlbums);
    return () => {
      window.removeEventListener('focus', updateAlbums);
      window.removeEventListener('storage', updateAlbums);
    };
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-main-bg text-text-light min-h-screen w-full">
      <h1 className="text-3xl font-bold tracking-tight">Recently Played Albums</h1>
      {albums.length === 0 ? (
        <p className="text-lg text-muted-foreground">No albums played yet. Play some music!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
          {albums.map(album => (
            <Link to={`/album/${encodeURIComponent(`${album.id}|${album.artist.id}`)}`} key={album.id} className="group block rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-surface-bg">
              <img src={album.cover} alt={album.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-2">
                <div className="font-semibold truncate text-text-light">{album.title}</div>
                <div className="text-xs text-text-light/80 truncate">{album.artist.name}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 