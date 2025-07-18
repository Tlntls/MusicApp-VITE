import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { usePlayerStore } from '../hooks/use-player-store';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

type AlbumWithYear = {
  id: string;
  title: string;
  coverArtPath: string;
  year?: number;
};

export default function ArtistDetail() {
  const { id } = useParams();
  const artistId = decodeURIComponent(id || '');
  const { songs, isLoading } = useMusic();
  const { playItem } = usePlayerStore();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-8 text-white">Loading artist details...</div>;
  }

  const songsByThisArtist = songs.filter(song => song.artist?.id === artistId);

  if (songsByThisArtist.length === 0) {
    return <div className="p-8 text-white">Artist not found or has no songs.</div>;
  }

  // Use the artist name from the first song
  const artistName = songsByThisArtist[0].artist?.name || artistId;

  const uniqueAlbumsMap = new Map<string, AlbumWithYear>();
  songsByThisArtist.forEach(song => {
    if (song.album && !uniqueAlbumsMap.has(song.album.id)) {
      uniqueAlbumsMap.set(song.album.id, {
        id: `${song.album.id}|${song.artist.id}`,
        title: song.album.title,
        coverArtPath: song.album.cover,
        year: song.album.year,
      });
    }
  });
  const albumsByThisArtist: AlbumWithYear[] = Array.from(uniqueAlbumsMap.values());
  // Pick a random album cover for the artist image on every render
  let artistCoverArt = '/placeholder-cover.png';
  if (albumsByThisArtist.length > 0) {
    const randomIndex = Math.floor(Math.random() * albumsByThisArtist.length);
    const randomAlbum = albumsByThisArtist[randomIndex];
    if (randomAlbum.coverArtPath) {
      artistCoverArt = `file://${randomAlbum.coverArtPath.replace(/\\/g, '/')}`;
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-main-bg text-text-light">
      <Button variant="ghost" className="mb-4 flex items-center justify-center w-10 h-10 p-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-7 w-7 font-bold" strokeWidth={3} />
      </Button>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 shadow-lg rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
          <img
            src={artistCoverArt}
            alt={`${artistName} portrait`}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mt-1">{artistName}</h1>
        </div>
      </div>
      <section>
        <h3 className="text-xl font-semibold mb-4">Albums</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albumsByThisArtist.map((album: AlbumWithYear) => (
            <Link key={album.id} to={`/album/${encodeURIComponent(album.id)}`}>
              <div className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col bg-surface-bg rounded-lg">
                <div className="relative bg-gray-700 w-[120px] h-[120px] md:w-[160px] md:h-[160px] flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={album.coverArtPath ? `file://${album.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={`${album.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-headline text-base truncate text-text-light">{album.title}</div>
                {album.year && <div className="text-xs text-muted-foreground">{album.year}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* Removed the Songs section below so only albums are shown */}
    </div>
  );
} 