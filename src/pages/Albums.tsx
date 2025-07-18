import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useMusic } from '../context/MusicContext';

type AlbumWithYear = {
  id: string;
  title: string;
  artist: string;
  coverArtPath: string;
  year?: number;
};

export default function Albums() {
  const { songs, folders, isLoading } = useMusic();
  console.log('Albums page: songs', songs);
  console.log('Albums page: folders', folders);

  if (isLoading) {
    return <div className="p-8 text-white">Loading albums...</div>;
  }

  const uniqueAlbumsMap = new Map<string, AlbumWithYear>();
  songs.forEach(song => {
    const albumKey = `${song.album.id}|${song.artist.id}`;
    if (!uniqueAlbumsMap.has(albumKey)) {
      uniqueAlbumsMap.set(albumKey, {
        id: albumKey,
        title: song.album.title,
        artist: song.artist.name,
        coverArtPath: song.album.cover,
        year: song.album.year,
      });
    }
  });
  const albums: AlbumWithYear[] = Array.from(uniqueAlbumsMap.values());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-main-bg text-text-light">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Albums ({albums.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albums.map((album: AlbumWithYear) => (
            <Link key={album.id} to={`/album/${encodeURIComponent(album.id)}`}>
              <div className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col bg-surface-bg rounded-lg">
                <div className="relative aspect-square bg-gray-700 min-w-[120px] min-h-[120px]">
                  <img
                    src={album.coverArtPath ? `file://${album.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={album.title || 'Album Art'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <div className="font-headline text-base truncate text-text-light">{album.title}</div>
                  <div className="truncate text-sm text-text-light/80">{album.artist}</div>
                  {album.year && <div className="text-xs text-muted-foreground">{album.year}</div>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 