import { useMusic } from '../context/MusicContext';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Play, Music } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SongActions } from '../components/song-actions';

export default function Songs() {
  const { songs, folders, isLoading } = useMusic();
  console.log('Songs page: songs', songs);
  console.log('Songs page: folders', folders);
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  const { playItem } = usePlayerStore();
  const [contextMenuIdx, setContextMenuIdx] = useState<number | null>(null);

  if (isLoading) {
    return <div className="p-8 text-white">Loading songs...</div>;
  }

  const sortedSongs = [...songs].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="flex-1 space-y-3 p-3 md:p-5 pt-4 bg-main-bg text-text-light">
      <div className="flex items-center justify-between space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Songs ({sortedSongs.length})</h2>
      </div>
      <section>
        <div className="divide-y divide-border rounded-lg overflow-hidden">
          {sortedSongs.map((song, idx) => (
            <div
              key={song.id}
              className={`flex items-center px-3 py-1.5 cursor-pointer group transition-colors duration-150 text-sm ${idx % 2 === 0 ? 'bg-surface-bg' : 'bg-main-bg'} hover:bg-accent/30`}
              onClick={() => playItem(song, sortedSongs)}
              onContextMenu={e => {
                e.preventDefault();
                setContextMenuIdx(idx);
              }}
              onMouseLeave={() => setContextMenuIdx(null)}
            >
              <div className="w-6 flex items-center justify-center">
                <span className="text-muted-foreground text-base font-mono transition-opacity duration-100 group-hover:opacity-0">{idx + 1}</span>
                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                  <Play className="h-4 w-4 text-accent" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-headline text-sm truncate font-semibold">{song.title}</div>
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
              <div className="w-12 text-right text-xs text-muted-foreground font-mono">
                {Math.floor((song.duration || 0) / 60)}:{((song.duration || 0) % 60).toString().padStart(2, '0')}
              </div>
              {contextMenuIdx === idx && (
                <div style={{ position: 'absolute', zIndex: 1000, right: 40, top: '100%' }}>
                  <SongActions song={song} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 