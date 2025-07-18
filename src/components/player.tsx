"use client";

import { usePlayerStore } from '../hooks/use-player-store';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Song, Chapter } from '../lib/types';
import { useNavigate, Link } from 'react-router-dom';
// Remove Dialog import

// --- TYPE DEFINITIONS ---
type PlayableItem = Song | Chapter;
const isSong = (item: PlayableItem): item is Song => 'album' in item;

// ===================================================================
// PLAYER COMPONENT (Corrected API Call)
// ===================================================================
export function Player() {
  const router = useNavigate();
  const { activeItem, isPlaying, togglePlay, playNext, playPrevious, shuffle, repeat, toggleShuffle, toggleRepeat } = usePlayerStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Ref to track the last played item to avoid sending duplicate events
  const lastPlayedId = useRef<string | null>(null);
  // Track previous activeItem to avoid resetting src on pause/resume
  const prevActiveItemRef = useRef<PlayableItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Get album cover for the active item
  let coverSrc = '/placeholder-cover.png';
  if (activeItem && isSong(activeItem) && activeItem.album?.cover) {
    coverSrc = activeItem.album.cover;
  } else if (activeItem && !isSong(activeItem) && activeItem?.audiobook?.cover) {
    coverSrc = activeItem.audiobook.cover;
  }

  // Get album name for the active item
  const albumName = activeItem && isSong(activeItem) ? activeItem.album?.title : '';

  // Effect to control the audio element's state and track plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only update src if the song actually changes
    if (activeItem?.src && prevActiveItemRef.current?.src !== activeItem.src) {
      audio.src = activeItem.src;
      setCurrentTime(0);
    }
    prevActiveItemRef.current = activeItem;

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
      <div className="h-24 border-t flex items-center justify-center text-muted-foreground" style={{ background: '#232136', color: '#fff' }}>
        Select a song to start playing.
      </div>
    );
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element) {
      if (e.target.closest('button') || e.target.closest('[role="slider"]')) return;
    }
    setExpanded(true);
  };

  const title = activeItem.title;
  const subtitle = isSong(activeItem)
    ? (activeItem.artist?.id
        ? <Link to={`/artists/${encodeURIComponent(activeItem.artist.id)}`} className="hover:underline hover:text-accent" onClick={e => e.stopPropagation()}>{activeItem.artist.name}</Link>
        : activeItem.artist?.name || 'Unknown Artist')
    : activeItem.audiobook?.author?.name || 'Unknown Author';
  const duration = activeItem.duration;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  // The compact player bar
  const playerBar = (
    <div className="w-full z-50" style={{ background: '#232136' }}>
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
      />
      <div 
        className="h-24 border-t px-4 md:px-6"
        style={{ background: '#232136', color: '#fff' }}
      >
        <div className="flex items-center h-full gap-4">
          <div className="flex items-center gap-4 w-1/4">
            <div 
              className="h-14 w-14 aspect-square rounded-md bg-gray-800 bg-cover bg-center flex-shrink-0 overflow-hidden cursor-pointer"
              onClick={() => setExpanded(true)}
            >
              <img
                src={coverSrc}
                alt="Album Art"
                className="w-full h-full object-cover"
                onError={e => (e.currentTarget.src = '/placeholder-cover.png')}
              />
            </div>
            <div>
              <p className="font-semibold truncate">{title}</p>
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 flex-1">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className={shuffle ? 'text-accent bg-accent/20' : 'text-muted-foreground hover:text-foreground'} onClick={toggleShuffle} aria-pressed={shuffle} title="Shuffle">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={playPrevious}><SkipBack className="h-6 w-6" /></Button>
              <Button size="icon" className="h-12 w-12 rounded-full" style={{ background: '#a78bfa', color: '#232136' }} onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext}><SkipForward className="h-6 w-6" /></Button>
              <Button variant="ghost" size="icon" className={repeat ? 'text-accent bg-accent/20' : 'text-muted-foreground hover:text-foreground'} onClick={toggleRepeat} aria-pressed={repeat} title="Repeat">
                <Repeat className="h-5 w-5" />
              </Button>
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

  // The expanded player overlay (full window, not modal)
  const expandedPlayer = expanded && (
    <div className="fixed inset-0 left-64 z-[100] flex items-center justify-center bg-black/90" style={{background: 'rgba(20,20,30,0.98)'}}>
      <button
        className="absolute top-6 right-8 text-3xl text-white/70 hover:text-white z-50"
        onClick={() => setExpanded(false)}
        aria-label="Close expanded player"
      >
        ×
      </button>
      <div className="flex flex-col md:flex-row items-center gap-12 p-8 w-full max-w-5xl">
        <div className="w-96 h-96 min-w-[120px] min-h-[120px] aspect-square rounded-lg overflow-hidden shadow-2xl bg-gray-800 flex-shrink-0">
          <img
            src={coverSrc}
            alt="Album Art Large"
            className="w-full h-full object-cover"
            onError={e => (e.currentTarget.src = '/placeholder-cover.png')}
          />
        </div>
        <div className="flex-1 flex flex-col gap-8 items-center md:items-start">
          <div>
            <p className="text-4xl font-black truncate mb-2">{title}</p>
            {albumName && <p className="text-2xl font-bold text-muted-foreground truncate mb-1">{albumName}</p>}
            <p className="text-lg text-muted-foreground truncate">{subtitle}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex items-center gap-8">
              <Button variant="ghost" size="icon" className={shuffle ? 'text-accent bg-accent/20' : 'text-muted-foreground hover:text-foreground'} onClick={toggleShuffle} aria-pressed={shuffle} title="Shuffle">
                <Shuffle className="h-8 w-8" />
              </Button>
              <Button variant="ghost" size="icon" onClick={playPrevious}><SkipBack className="h-10 w-10" /></Button>
              <Button size="icon" className="h-20 w-20 rounded-full" style={{ background: '#a78bfa', color: '#232136' }} onClick={togglePlay}>
                {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNext}><SkipForward className="h-10 w-10" /></Button>
              <Button variant="ghost" size="icon" className={repeat ? 'text-accent bg-accent/20' : 'text-muted-foreground hover:text-foreground'} onClick={toggleRepeat} aria-pressed={repeat} title="Repeat">
                <Repeat className="h-8 w-8" />
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-2xl">
              <span className="text-base text-muted-foreground tabular-nums">{formatTime(currentTime)}</span>
              <Slider value={[progress]} max={100} step={1} onValueChange={handleSeek} className="flex-1" />
              <span className="text-base text-muted-foreground tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full justify-end">
            <Volume2 className="h-6 w-6 text-muted-foreground" />
            <Slider value={[volume * 100]} max={100} step={1} onValueChange={handleVolumeChange} className="w-40" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {playerBar}
      {expandedPlayer}
    </>
  );
}
