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
    <div className="flex-1 space-y-3 p-3 md:p-5 pt-4 bg-main-bg text-text-light">
      <div className="flex items-center justify-between space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Albums ({albums.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {albums.map((album: AlbumWithYear) => (
            <Link key={album.id} to={`/album/${encodeURIComponent(album.id)}`}>
              <div className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col bg-surface-bg rounded-lg p-2 gap-2">
                <div className="relative aspect-square bg-gray-700 min-w-[80px] min-h-[80px]">
                  <img
                    src={album.coverArtPath ? `file://${album.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={album.title || 'Album Art'}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-0.5 flex-grow">
                  <div className="font-headline text-sm truncate text-text-light font-semibold">{album.title}</div>
                  <div className="text-xs text-muted-foreground truncate w-full">{album.artist}</div>
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