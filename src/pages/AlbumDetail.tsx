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
    <div className="p-4 md:p-8 space-y-6 bg-main-bg text-text-light">
      <Button variant="ghost" className="mb-4 flex items-center justify-center w-10 h-10 p-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-7 w-7 font-bold" strokeWidth={3} />
      </Button>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] shadow-lg min-w-[120px] min-h-[120px] flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={album.cover ? `file://${album.cover.replace(/\\/g, '/')}` : '/placeholder-cover.png'}
            alt={`${album.title} cover`}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mt-1">{album.title}</h1>
          <h3 className="text-lg font-semibold mt-2">{album.artist.name}</h3>
          {album.year && <div className="text-xs text-muted-foreground">{album.year}</div>}
        </div>
      </div>
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Track</TableHead>
              <TableHead className="text-right"><Clock className="inline-block h-4 w-4" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {album.songs.map((song, index) => (
              <TableRow
                key={song.id}
                className={`group cursor-pointer transition-colors duration-150 ${index % 2 === 0 ? 'bg-surface-bg' : 'bg-main-bg'} hover:bg-accent/30`}
                onClick={() => playItem(song, album.songs)}
              >
                <TableCell className="flex items-center gap-2 font-semibold">
                  <span className="text-muted-foreground w-6 text-right transition-opacity duration-100 group-hover:opacity-0">{index + 1}</span>
                  <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                    <Play className="h-5 w-5 text-accent" />
                  </span>
                  <span className="ml-2">{song.title}</span>
                  <span className="ml-auto"><SongActions song={song} /></span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground font-mono">{Math.floor((song.duration || 0) / 60)}:{((song.duration || 0) % 60).toString().padStart(2, '0')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
} 