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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Artists ({artists.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <Link key={artist.id} to={`/artists/${encodeURIComponent(artist.id)}`}>
              <Card className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col">
                <div className="relative aspect-square bg-gray-700">
                  <img
                    src={artist.coverArtPath || '/placeholder-cover.png'}
                    alt={`${artist.name} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 flex-grow">
                  <CardTitle
                    className="font-headline"
                    style={{
                      height: '2.8em',
                      lineHeight: '1.4em',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {artist.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 