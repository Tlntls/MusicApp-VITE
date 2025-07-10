import { useParams, Link } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { usePlayerStore } from '../hooks/use-player-store';

export default function ArtistDetail() {
  const { id } = useParams();
  const artistId = decodeURIComponent(id || '');
  const { songs, isLoading } = useMusic();
  const { playItem } = usePlayerStore();

  if (isLoading) {
    return <div className="p-8 text-white">Loading artist details...</div>;
  }

  const songsByThisArtist = songs.filter(song => song.artist?.id === artistId);

  if (songsByThisArtist.length === 0) {
    return <div className="p-8 text-white">Artist not found or has no songs.</div>;
  }

  // Use the artist name from the first song
  const artistName = songsByThisArtist[0].artist?.name || artistId;

  const uniqueAlbumsMap = new Map();
  songsByThisArtist.forEach(song => {
    if (song.album && !uniqueAlbumsMap.has(song.album.id)) {
      uniqueAlbumsMap.set(song.album.id, {
        id: `${song.album.id}|${song.artist.id}`,
        title: song.album.title,
        coverArtPath: song.album.cover
      });
    }
  });
  const albumsByThisArtist = Array.from(uniqueAlbumsMap.values());
  const artistCoverArt = songsByThisArtist.find(song => song.album?.cover)?.album?.cover;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 shadow-lg">
          <Avatar className="w-full h-full">
            <AvatarImage asChild>
              <img
                src={artistCoverArt ? `file://${artistCoverArt.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                alt={`${artistName} portrait`}
                className="object-cover"
              />
            </AvatarImage>
            <AvatarFallback>{artistName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Artist</h2>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mt-1">{artistName}</h1>
        </div>
      </div>
      <section>
        <h3 className="text-xl font-semibold mb-4">Albums</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albumsByThisArtist.map((album) => (
            <Link key={album.id} to={`/album/${encodeURIComponent(album.id)}`}>
              <Card className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col">
                <div className="relative aspect-square bg-gray-700">
                  <img
                    src={album.coverArtPath ? `file://${album.coverArtPath.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
                    alt={`${album.title} cover`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 flex-grow">
                  <CardTitle className="truncate font-headline text-base">{album.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-4">Songs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {songsByThisArtist.map((song) => {
            let coverSrc = '/placeholder-cover.png';
            if (song.album?.cover) {
              coverSrc = song.album.cover;
            }
            return (
              <div key={song.id} className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col group"
                onClick={() => playItem(song, songsByThisArtist)}>
                <div className="relative aspect-square bg-gray-700">
                  <img
                    src={coverSrc}
                    className="w-full h-full object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="h-6 w-6 text-gray-900 fill-current" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <div className="font-headline text-sm" style={{ height: '2.8em', lineHeight: '1.4em', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                  <div className="text-xs text-muted-foreground truncate w-full">{artistName}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
} 