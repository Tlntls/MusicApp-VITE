import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { useMusic } from '../context/MusicContext';

export default function Artists() {
  const { songs, folders, isLoading } = useMusic();
  console.log('Artists page: songs', songs);
  console.log('Artists page: folders', folders);

  console.log('Artists page: songs =', songs);

  if (isLoading) {
    return <div className="p-8 text-white">Loading artists...</div>;
  }

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

  console.log('Artists page: artists =', artists);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-main-bg text-text-light">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Artists ({artists.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <Link key={artist.id} to={`/artists/${encodeURIComponent(artist.id)}`}>
              <div className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col bg-surface-bg rounded-lg">
                <div className="relative aspect-square bg-gray-700">
                  <img
                    src={artist.coverArtPath ? `file://${artist.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={`${artist.name} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <div className="font-headline text-lg font-bold truncate text-text-light">{artist.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 