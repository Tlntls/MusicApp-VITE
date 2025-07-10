import { useParams } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Music, Clock } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';

export default function AlbumDetail() {
  const { id } = useParams();
  const albumId = decodeURIComponent(id || '');
  const { songs, isLoading } = useMusic();
  const { playItem } = usePlayerStore();

  if (isLoading) {
    return <div className="p-8 text-white">Loading album details...</div>;
  }

  const songsForThisAlbum = songs.filter(song => `${song.album?.id}|${song.artist?.id}` === albumId);

  if (songsForThisAlbum.length === 0) {
    return <div className="p-8 text-white">Album not found or has no songs.</div>;
  }

  const album = {
    title: songsForThisAlbum[0].album?.title || '',
    artist: { name: songsForThisAlbum[0].artist?.name || '' },
    songs: songsForThisAlbum,
    cover: songsForThisAlbum[0].album?.cover || '/placeholder-cover.png',
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-48 md:h-48 shadow-lg">
          <img
            src={album.cover ? `file://${album.cover.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
            alt={`${album.title} cover`}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Album</h2>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mt-1">{album.title}</h1>
          <h3 className="text-lg font-semibold mt-2">{album.artist.name}</h3>
        </div>
      </div>
      <section>
        <h3 className="text-xl font-semibold mb-4">Songs</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right"><Clock className="inline-block h-4 w-4" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {album.songs.map((song, index) => (
              <TableRow key={song.id} className="group cursor-pointer" onClick={() => playItem(song, album.songs)}>
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-semibold">{song.title}</TableCell>
                <TableCell className="text-right text-muted-foreground">{Math.floor((song.duration || 0) / 60)}:{((song.duration || 0) % 60).toString().padStart(2, '0')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
} 