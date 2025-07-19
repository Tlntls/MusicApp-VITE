import { useParams, useNavigate } from 'react-router-dom';
import { audiobooks } from '../lib/mock-data';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { usePlayerStore } from '../hooks/use-player-store';

export default function AudiobookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setQueue, playItem, activeItem } = usePlayerStore();
  const audiobook = audiobooks.find((a) => a.id === id);

  if (!audiobook) {
    return <div className="p-8 text-white">Audiobook not found.</div>;
  }

  const handlePlayAudiobook = () => {
    setQueue(audiobook.chapters);
  };

  const handlePlayChapter = (chapter: any) => {
    playItem(chapter, audiobook.chapters);
  };

  const formatDuration = (totalSeconds: number) => {
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
    <div className="p-3 md:p-5 space-y-4">
      <Button variant="ghost" className="mb-2 flex items-center justify-center w-8 h-8 p-0" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-5 w-5 font-bold" strokeWidth={2} />
      </Button>
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:w-1/4 lg:w-1/6">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
            <img src={audiobook.cover} alt={`${audiobook.title} cover`} className="object-cover w-full h-full rounded-md" />
          </div>
        </div>
        <div className="flex-1 pt-2">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Audiobook</h2>
          <h1 className="text-xl md:text-2xl font-bold font-headline tracking-tight mt-1">{audiobook.title}</h1>
          <p className="text-base text-muted-foreground mt-1">By {audiobook.author.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{audiobook.chapters.length} chapters</p>
          <p className="text-xs text-muted-foreground mt-3 max-w-prose">{audiobook.description}</p>
          <Button onClick={handlePlayAudiobook} className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground text-xs py-1 px-3">
            <Play className="mr-2 h-4 w-4 fill-current" />
            Play Audiobook
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 text-xs">#</TableHead>
              <TableHead className="text-xs">Title</TableHead>
              <TableHead className="text-right text-xs">
                <Clock className="inline-block h-3 w-3" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audiobook.chapters.map((chapter) => {
              const isActive = activeItem?.id === chapter.id;
              return (
                <TableRow
                  key={chapter.id}
                  className={`group cursor-pointer ${isActive ? 'bg-accent/30' : ''} text-sm`}
                  onClick={() => handlePlayChapter(chapter)}
                >
                  <TableCell className="py-1 px-2">{chapter.chapterNumber}</TableCell>
                  <TableCell className="truncate py-1 px-2">{chapter.title}</TableCell>
                  <TableCell className="text-right text-xs py-1 px-2">{formatDuration(chapter.duration)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 