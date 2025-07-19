import { useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Music, Clock, ArrowLeft } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';
import { SongActions } from '../components/song-actions';

type AlbumWithYear = {
  title: string;
  artist: { name: string };
  cover: string;
  year?: number;
  songs: any[];
};

export default function AlbumDetail() {
  const { id } = useParams();
  const albumId = decodeURIComponent(id || '');
  const { songs, isLoading } = useMusic();
  const { playItem } = usePlayerStore();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="p-8 text-white">Loading album details...</div>;
  }

  const songsForThisAlbum = songs.filter(song => `${song.album?.id}|${song.artist?.id}` === albumId);

  if (songsForThisAlbum.length === 0) {
    return <div className="p-8 text-white">Album not found or has no songs.</div>;
  }

  const album: AlbumWithYear = {
    title: songsForThisAlbum[0].album.title,
    artist: { name: songsForThisAlbum[0].artist.name },
    cover: songsForThisAlbum[0].album.cover,
    year: songsForThisAlbum[0].album.year,
    songs: songsForThisAlbum,
  };

  return (
    <div className="p-3 md:p-5 space-y-4 bg-main-bg text-text-light">
      <Button variant="ghost" className="mb-2 flex items-center justify-center w-8 h-8 p-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-5 w-5 font-bold" strokeWidth={2} />
      </Button>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] shadow-lg min-w-[80px] min-h-[80px] flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={album.cover ? `file://${album.cover.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
            alt={`${album.title} cover`}
            className="object-cover w-full h-full rounded-md"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold font-headline tracking-tight mt-1">{album.title}</h1>
          <h3 className="text-sm font-medium mt-1">{album.artist.name}</h3>
          {album.year && <div className="text-xs text-muted-foreground">{album.year}</div>}
        </div>
      </div>
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Track</TableHead>
              <TableHead className="text-right text-xs"><Clock className="inline-block h-3 w-3" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {album.songs.map((song, index) => (
              <TableRow
                key={song.id}
                className={`group cursor-pointer transition-colors duration-150 text-sm ${index % 2 === 0 ? 'bg-surface-bg' : 'bg-main-bg'} hover:bg-accent/30`}
                onClick={() => playItem(song, album.songs)}
              >
                <TableCell className="flex items-center gap-2 font-semibold py-1 px-2">
                  <span className="text-muted-foreground w-5 text-right transition-opacity duration-100 group-hover:opacity-0 text-base">{index + 1}</span>
                  <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                    <Play className="h-4 w-4 text-accent" />
                  </span>
                  <span className="ml-2 truncate text-sm">{song.title}</span>
                  <span className="ml-auto"><SongActions song={song} /></span>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground font-mono">{Math.floor((song.duration || 0) / 60)}:{((song.duration || 0) % 60).toString().padStart(2, '0')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
} 