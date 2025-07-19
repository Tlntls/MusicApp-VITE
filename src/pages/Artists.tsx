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
        year: song.album.year, // Ensure year is included
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
    <div className="flex h-full w-full bg-main-bg text-text-light min-h-0">
      {/* Left pane: artist list */}
      <aside className="w-64 min-w-[180px] max-w-xs border-r bg-surface-bg h-full flex flex-col min-h-0">
        <h2 className="text-base font-semibold px-3 py-3 tracking-tight">Artists ({artists.length})</h2>
        <div className="flex-1 min-h-0 overflow-auto">
          <ul className="flex flex-col gap-0.5">
            {artists.map(artist => (
              <li key={artist.id}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-1.5 hover:bg-accent/20 transition-colors text-sm ${selectedArtistId === artist.id ? 'bg-accent/30 font-bold' : ''}`}
                  onClick={() => setSelectedArtistId(artist.id)}
                >
                  <img
                    src={artist.coverArtPath ? `file://${artist.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={artist.name}
                    className="rounded-full w-8 h-8 object-cover border border-muted"
                  />
                  <span className="truncate text-left">{artist.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Right pane: all albums for selected artist, each with tracklist */}
      <main className="flex-1 p-4 overflow-auto min-h-0">
        {isLoading ? (
          <div className="p-8 text-white">Loading artist details...</div>
        ) : !selectedArtist ? (
          <div className="p-8 text-white">No artist selected.</div>
        ) : (
          <>
            <section>
              <h3 className="text-lg font-semibold mb-3 tracking-tight">Albums</h3>
              {albums.length === 0 ? (
                <div className="text-muted-foreground">No albums found for this artist.</div>
              ) : (
                <div className="flex flex-col gap-6">
                  {albums.map((album: AlbumWithSongs) => (
                    <div key={album.id} className="flex flex-col md:flex-row gap-4 items-start bg-surface-bg rounded-lg shadow p-4 overflow-hidden min-w-0">
                      <img
                        src={album.cover ? `file://${album.cover.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                        alt={album.title}
                        className="rounded-lg w-28 h-28 object-cover border border-muted shadow-lg mb-2 md:mb-0"
                      />
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-end md:gap-3 min-w-0">
                          <h2 className="text-base font-semibold font-headline tracking-tight mb-0.5 md:mb-0 truncate min-w-0">{album.title}</h2>
                          {album.year && <div className="text-xs text-muted-foreground">{album.year}</div>}
                          <div className="text-xs text-muted-foreground">{album.songs.length} song{album.songs.length !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="mt-2">
                          <ul className="divide-y divide-border rounded-lg overflow-hidden">
                            {album.songs.map((song, idx) => (
                              <li
                                key={song.id}
                                className={`relative flex items-center px-3 py-1.5 cursor-pointer group transition-colors duration-150 text-sm ${idx % 2 === 0 ? 'bg-surface-bg' : 'bg-main-bg'} hover:bg-accent/30 min-w-0`}
                                onClick={() => playItem(song, album.songs)}
                              >
                                <span className="text-muted-foreground text-base font-mono transition-opacity duration-100 group-hover:opacity-0 w-6 text-right">{idx + 1}</span>
                                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100 left-3">
                                  <Play className="h-4 w-4 text-accent" />
                                </span>
                                <span className="ml-2 flex-1 truncate min-w-0">{song.title}</span>
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