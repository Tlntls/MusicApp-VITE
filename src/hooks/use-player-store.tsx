// src/hooks/use-player-store.ts

'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'; // Import useCallback
import type { Song, Chapter } from '../lib/types';
// We remove the mock data import as it's not needed here
// import { songs as allSongs } from '../lib/mock-data'; 

type PlayableItem = Song | Chapter;

interface PlayerState {
  queue: PlayableItem[];
  activeItem: PlayableItem | null;
  isPlaying: boolean;
  playItem: (item: PlayableItem, queue?: PlayableItem[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setQueue: (items: PlayableItem[], startItem?: PlayableItem) => void;
  addItemToQueueNext: (item: PlayableItem) => void;
}

const PlayerContext = createContext<PlayerState | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<PlayableItem[]>([]);
  const [activeItem, setActiveItem] = useState<PlayableItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playItem = useCallback((item: PlayableItem, itemQueue: PlayableItem[] = []) => {
    setActiveItem(item);
    if (itemQueue.length > 0) {
        const currentItemIndex = itemQueue.findIndex(s => s.id === item.id);
        if (currentItemIndex !== -1) {
            setQueue(itemQueue.slice(currentItemIndex));
        } else {
            setQueue(itemQueue);
        }
    } else {
      setQueue([item]);
    }
    setIsPlaying(true);
  }, []);
  
  const addItemToQueueNext = useCallback((item: PlayableItem) => {
    if (!activeItem) {
      playItem(item);
      return;
    }
    
    setQueue(currentQueue => {
        const currentIndex = currentQueue.findIndex(s => s.id === activeItem.id);
        const newQueue = [...currentQueue];
        if (currentIndex !== -1) {
          newQueue.splice(currentIndex + 1, 0, item);
        } else {
          newQueue.unshift(item);
        }
        return newQueue;
    });
  }, [activeItem, playItem]);

  const setItemsAndPlay = useCallback((items: PlayableItem[], startItem?: PlayableItem) => {
    const itemToPlay = startItem || items[0];
    if (itemToPlay) {
      setQueue(items);
      setActiveItem(itemToPlay);
      setIsPlaying(true);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (activeItem) {
      setIsPlaying(prev => !prev);
    } else if (queue.length > 0) {
      setActiveItem(queue[0]);
      setIsPlaying(true);
    }
  }, [activeItem, queue]);

  const playNext = useCallback(() => {
    if (!activeItem) return;
    const currentIndex = queue.findIndex(s => s.id === activeItem.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setActiveItem(queue[nextIndex]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [activeItem, queue]);

  const playPrevious = useCallback(() => {
    if (!activeItem) return;
    const currentIndex = queue.findIndex(s => s.id === activeItem.id);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setActiveItem(queue[prevIndex]);
      setIsPlaying(true);
    }
  }, [activeItem, queue]);

  // The value provided to the context now contains the stable functions
  const value = {
    queue,
    activeItem,
    isPlaying,
    playItem,
    togglePlay,
    playNext,
    playPrevious,
    setQueue: setItemsAndPlay,
    addItemToQueueNext,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayerStore = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerStore must be used within a PlayerProvider');
  }
  return context;
};