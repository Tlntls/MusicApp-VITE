import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useMusic } from '../context/MusicContext';

export default function Albums() {
  const { songs, folders, isLoading } = useMusic();
  console.log('Albums page: songs', songs);
  console.log('Albums page: folders', folders);

  if (isLoading) {
    return <div className="p-8 text-white">Loading albums...</div>;
  }

  const uniqueAlbumsMap = new Map();
  songs.forEach(song => {
    const albumKey = `${song.album?.id}|${song.artist?.id}`;
    if (!uniqueAlbumsMap.has(albumKey) && song.album) {
      uniqueAlbumsMap.set(albumKey, {
        id: albumKey,
        title: song.album?.title || song.album,
        artist: song.artist?.name || song.artist,
        coverArtPath: song.album?.cover || '/placeholder-cover.png',
      });
    }
  });
  const albums = Array.from(uniqueAlbumsMap.values());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Albums ({albums.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albums.map((album) => (
            <Link key={album.id} to={`/album/${encodeURIComponent(album.id)}`}>
              <Card className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col">
                <div className="relative aspect-square bg-gray-700">
                  <img
                    src={album.coverArtPath ? `file://${album.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={album.title || 'Album Art'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 flex-grow">
                  <CardTitle className="truncate font-headline">{album.title}</CardTitle>
                  <CardDescription className="truncate">{album.artist}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 