import { useParams } from 'react-router-dom';
import { audiobooks } from '../lib/mock-data';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Play, Clock } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';

export default function AudiobookDetail() {
  const { id } = useParams();
  const { setQueue, playItem, activeItem } = usePlayerStore();
  const audiobook = audiobooks.find((a) => a.id === id);

  if (!audiobook) {
    return <div className="p-8 text-white">Audiobook not found.</div>;
  }

  const handlePlayAudiobook = () => {
    setQueue(audiobook.chapters);
  };

  const handlePlayChapter = (chapter) => {
    playItem(chapter, audiobook.chapters);
  };

  const formatDuration = (totalSeconds) => {
    if (isNaN(totalSeconds)) return "0:00";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
            <img src={audiobook.cover} alt={`${audiobook.title} cover`} className="object-cover w-full h-full" />
          </div>
        </div>
        <div className="flex-1 pt-4">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Audiobook</h2>
          <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mt-1">{audiobook.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">By {audiobook.author.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{audiobook.chapters.length} chapters</p>
          <p className="text-sm text-muted-foreground mt-4 max-w-prose">{audiobook.description}</p>
          <Button onClick={handlePlayAudiobook} className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Play className="mr-2 h-5 w-5 fill-current" />
            Play Audiobook
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">
                <Clock className="inline-block h-4 w-4" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audiobook.chapters.map((chapter) => {
              const isActive = activeItem?.id === chapter.id;
              return (
                <TableRow
                  key={chapter.id}
                  className={`group cursor-pointer ${isActive ? 'bg-accent/30' : ''}`}
                  onClick={() => handlePlayChapter(chapter)}
                >
                  <TableCell>{chapter.chapterNumber}</TableCell>
                  <TableCell>{chapter.title}</TableCell>
                  <TableCell className="text-right">{formatDuration(chapter.duration)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 