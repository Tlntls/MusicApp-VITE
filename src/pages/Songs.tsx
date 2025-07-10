import { useMusic } from '../context/MusicContext';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Play, Music } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';

export default function Songs() {
  const { songs, folders, isLoading } = useMusic();
  console.log('Songs page: songs', songs);
  console.log('Songs page: folders', folders);
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  const { playItem } = usePlayerStore();

  if (isLoading) {
    return <div className="p-8 text-white">Loading songs...</div>;
  }

  const sortedSongs = [...songs].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-main-bg text-text-light">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Songs ({sortedSongs.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedSongs.map((song) => {
            let coverSrc = '/placeholder-cover.png';
            if (isElectron && song.album?.cover) {
              coverSrc = song.album.cover;
            } else if (song.album?.cover) {
              coverSrc = song.album.cover;
            }
            return (
              <div key={song.id} className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col group bg-surface-bg rounded-lg"
                onClick={() => playItem(song, sortedSongs)}>
                <div className="relative aspect-square bg-gray-700">
                  <img
                    src={coverSrc}
                    className="w-full h-full object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Play className="h-6 w-6 text-gray-900 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <div className="font-headline text-sm" style={{ height: '2.8em', lineHeight: '1.4em', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                  <div className="text-xs text-text-light/80 truncate w-full">{song.artist?.name || 'Unknown Artist'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
} 