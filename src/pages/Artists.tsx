import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { Play } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';

// Album type for right pane
type AlbumWithSongs = {
  id: string;
  title: string;
  cover: string;
  year?: number;
  songs: any[];
};

export default function Artists() {
  const { songs, isLoading } = useMusic();
  const { playItem } = usePlayerStore();

  // Map of artistId -> { id, name, coverArtPath }
  const uniqueArtistsMap = new Map();
  songs.forEach(song => {
    if (!song.artist?.id || !song.artist?.name) return;
    if (!uniqueArtistsMap.has(song.artist.id)) {
      uniqueArtistsMap.set(song.artist.id, {
        id: song.artist.id,
        name: song.artist.name,
        coverArtPath: song.album?.cover || '/placeholder-cover.png',
      });
    } else if (!uniqueArtistsMap.get(song.artist.id).coverArtPath && song.album?.cover) {
      uniqueArtistsMap.get(song.artist.id).coverArtPath = song.album.cover;
    }
  });
  const artists = Array.from(uniqueArtistsMap.values());
  artists.sort((a, b) => a.name.localeCompare(b.name));

  // State for selected artist
  const [selectedArtistId, setSelectedArtistId] = useState(artists[0]?.id || null);
  useEffect(() => {
    if (artists.length > 0 && !selectedArtistId) {
      setSelectedArtistId(artists[0].id);
    }
  }, [artists, selectedArtistId]);

  // Get albums for selected artist
  const albumsMap: Record<string, AlbumWithSongs> = {};
  songs.forEach(song => {
    if (!song.album?.id || !song.album?.title) return;
    if (song.artist?.id !== selectedArtistId) return;
    if (!albumsMap[song.album.id]) {
      albumsMap[song.album.id] = {
        id: song.album.id,
        title: song.album.title,
        cover: song.album.cover,
        year: song.album.year,
        songs: [],
      };
    }
    albumsMap[song.album.id].songs.push(song);
  });
  const albums: AlbumWithSongs[] = Object.values(albumsMap);
  albums.sort((a, b) => (b.year || 0) - (a.year || 0));

  const selectedArtist = artists.find(a => a.id === selectedArtistId);

  // Remove selectedAlbumId and selectedAlbum state

  return (
    <div className="flex h-full w-full bg-main-bg text-text-light">
      {/* Left pane: artist list */}
      <aside className="w-64 min-w-[200px] max-w-xs border-r bg-surface-bg h-full overflow-y-auto">
        <h2 className="text-xl font-bold px-4 py-4">Artists ({artists.length})</h2>
        <ul className="flex flex-col">
          {artists.map(artist => (
            <li key={artist.id}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-accent/20 transition-colors ${selectedArtistId === artist.id ? 'bg-accent/30 font-bold' : ''}`}
                onClick={() => setSelectedArtistId(artist.id)}
              >
                <img
                  src={artist.coverArtPath ? `file://${artist.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                  alt={artist.name}
                  className="rounded-full w-10 h-10 object-cover border border-muted"
                />
                <span className="truncate text-left">{artist.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Right pane: all albums for selected artist, each with tracklist */}
      <main className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-white">Loading artist details...</div>
        ) : !selectedArtist ? (
          <div className="p-8 text-white">No artist selected.</div>
        ) : (
          <>
            <section>
              <h3 className="text-2xl font-bold mb-4">Albums</h3>
              {albums.length === 0 ? (
                <div className="text-muted-foreground">No albums found for this artist.</div>
              ) : (
                <div className="flex flex-col gap-12">
                  {albums.map((album: AlbumWithSongs) => (
                    <div key={album.id} className="flex flex-col md:flex-row gap-8 items-start bg-surface-bg rounded-lg shadow p-6">
                      <img
                        src={album.cover ? `file://${album.cover.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                        alt={album.title}
                        className="rounded-lg w-40 h-40 object-cover border border-muted shadow-lg mb-4 md:mb-0"
                      />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex flex-col md:flex-row md:items-end md:gap-4">
                          <h2 className="text-2xl font-bold font-headline tracking-tight mb-1 md:mb-0">{album.title}</h2>
                          {album.year && <div className="text-sm text-muted-foreground">{album.year}</div>}
                          <div className="text-xs text-muted-foreground">{album.songs.length} song{album.songs.length !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="mt-4">
                          <ul className="divide-y divide-border rounded-lg overflow-hidden">
                            {album.songs.map((song, idx) => (
                              <li
                                key={song.id}
                                className={`flex items-center px-4 py-3 cursor-pointer group transition-colors duration-150 ${idx % 2 === 0 ? 'bg-surface-bg' : 'bg-main-bg'} hover:bg-accent/30`}
                                onClick={() => playItem(song, album.songs)}
                              >
                                <span className="text-muted-foreground text-lg font-mono transition-opacity duration-100 group-hover:opacity-0 w-8 text-right">{idx + 1}</span>
                                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                                  <Play className="h-5 w-5 text-accent" />
                                </span>
                                <span className="ml-2 flex-1 truncate">{song.title}</span>
                                <span className="ml-auto text-xs text-muted-foreground font-mono">{Math.floor((song.duration || 0) / 60)}:{((song.duration || 0) % 60).toString().padStart(2, '0')}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
} 