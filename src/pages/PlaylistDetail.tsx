import { useParams, Link } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistContext';
import { Play } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';
import { useState } from 'react';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { playlists } = usePlaylists();
  const { playItem } = usePlayerStore();
  const playlist = playlists.find(p => p.id === id);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!playlist) {
    return <div className="p-8 text-white">Playlist not found.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-main-bg text-text-light">
      <h1 className="text-3xl font-bold mb-4">{playlist.name}</h1>
      <div className="divide-y divide-border rounded-lg overflow-hidden">
        {playlist.songs.length === 0 ? (
          <div className="text-muted-foreground p-4">No songs in this playlist yet.</div>
        ) : (
          playlist.songs.map((song, idx) => (
            <div
              key={song.id}
              className={`flex items-center px-4 py-3 cursor-pointer group transition-colors duration-150 ${idx % 2 === 0 ? 'bg-surface-bg' : 'bg-main-bg'} hover:bg-accent/30`}
              onClick={() => playItem(song, playlist.songs)}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              <div className="w-8 flex items-center justify-center">
                <span className="text-muted-foreground text-lg font-mono transition-opacity duration-100 group-hover:opacity-0">{idx + 1}</span>
                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                  <Play className="h-5 w-5 text-accent" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-headline text-base truncate">{song.title}</div>
                <div className="text-xs text-text-light/80 truncate">
                  {song.artist?.id ? (
                    <Link
                      to={`/artists/${encodeURIComponent(song.artist.id)}`}
                      className="hover:underline hover:text-accent"
                      onClick={e => e.stopPropagation()}
                    >
                      {song.artist.name}
                    </Link>
                  ) : (
                    song.artist?.name || 'Unknown Artist'
                  )}
                </div>
              </div>
              <div className="w-16 text-right text-muted-foreground font-mono">
                {Math.floor((song.duration || 0) / 60)}:{((song.duration || 0) % 60).toString().padStart(2, '0')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 