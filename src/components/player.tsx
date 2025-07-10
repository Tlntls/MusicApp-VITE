"use client";

import { usePlayerStore } from '../hooks/use-player-store';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Song, Chapter } from '../lib/types';
import { useNavigate } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
type PlayableItem = Song | Chapter;
const isSong = (item: PlayableItem): item is Song => 'album' in item;

// ===================================================================
// PLAYER COMPONENT (Corrected API Call)
// ===================================================================
export function Player() {
  const router = useNavigate();
  const { activeItem, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [coverSrc, setCoverSrc] = useState('/placeholder-cover.png');
  
  // Ref to track the last played item to avoid sending duplicate events
  const lastPlayedId = useRef<string | null>(null);

  // Effect to control the audio element's state and track plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeItem?.src && audio.src !== activeItem.src) {
      audio.src = activeItem.src;
      setCurrentTime(0);
    }
    
    if (isPlaying) {
      audio.play().catch(e => {
        if (e.name !== 'AbortError') console.error("Error playing audio:", e);
      });

      // --- CORRECTED LOGIC TO TRACK SONG PLAY ---
      if (activeItem && isSong(activeItem) && activeItem.id !== lastPlayedId.current) {
        console.log(`UI: Song played, sending to main process:`, activeItem.title);
        // This now calls the correct function exposed in your preload.js
        (window as any).electronAPI.songPlayed(activeItem);
        lastPlayedId.current = activeItem.id;
      }
      // ------------------------------------

    } else {
      audio.pause();
    }
  }, [activeItem, isPlaying]);

  // Effect to control the volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Effect to safely update the cover art source
  useEffect(() => {
    if (activeItem && isSong(activeItem) && activeItem?.album?.cover) {
      setCoverSrc(activeItem.album.cover);
    } else if (activeItem && !isSong(activeItem) && activeItem?.audiobook?.cover) {
      setCoverSrc(activeItem.audiobook.cover);
    } else {
      setCoverSrc('/placeholder-cover.png');
    }
  }, [activeItem]);

  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleSongEnd = () => { playNext(); };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && activeItem?.duration) {
      const newTime = (value[0] / 100) * activeItem.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!activeItem) {
    return (
      <div className="h-24 border-t bg-background/95 backdrop-blur-sm flex items-center justify-center text-muted-foreground">
        Select a song to start playing.
      </div>
    );
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element) {
      if (e.target.closest('button') || e.target.closest('[role="slider"]')) return;
    }
  };

  const title = activeItem.title;
  const subtitle = isSong(activeItem) ? activeItem.artist?.name || 'Unknown Artist' : activeItem.audiobook?.author?.name || 'Unknown Author';
  const duration = activeItem.duration;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
      />
      <div 
        className="h-24 border-t bg-background/95 backdrop-blur-sm px-4 md:px-6 cursor-pointer"
        onClick={handleContainerClick}
      >
        <div className="flex items-center h-full gap-4">
          <div className="flex items-center gap-4 w-1/4">
            <div 
              className="h-14 w-14 rounded-md bg-gray-800 bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url("${coverSrc}")` }}
            >
            </div>
            <div>
              <p className="font-semibold truncate">{title}</p>
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-2 flex-1">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Shuffle className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" onClick={playPrevious}><SkipBack className="h-6 w-6" /></Button>
              <Button variant="default" size="icon" className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                {isPlaying ? <Pause className="h-6 w-6 fill-accent-foreground" /> : <Play className="h-6 w-6 fill-accent-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext}><SkipForward className="h-6 w-6" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><Repeat className="h-5 w-5" /></Button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-lg">
              <span className="text-xs text-muted-foreground tabular-nums">{formatTime(currentTime)}</span>
              <Slider value={[progress]} max={100} step={1} onValueChange={handleSeek} className="flex-1" />
              <span className="text-xs text-muted-foreground tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-1/4 justify-end">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider value={[volume * 100]} max={100} step={1} onValueChange={handleVolumeChange} className="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
