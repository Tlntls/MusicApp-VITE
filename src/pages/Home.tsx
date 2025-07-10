import { getRecentlyPlayedAlbums } from '../hooks/use-player-store';
import { Link } from 'react-router-dom';

export default function Home() {
  const albums = getRecentlyPlayedAlbums(10);
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Recently Played Albums</h1>
      {albums.length === 0 ? (
        <p className="text-lg text-muted-foreground">No albums played yet. Play some music!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {albums.map(album => (
            <Link to={`/album/${album.id}`} key={album.id} className="group block rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <img src={album.cover} alt={album.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
              <div className="p-2">
                <div className="font-semibold truncate">{album.title}</div>
                <div className="text-xs text-muted-foreground truncate">{album.artist.name}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 