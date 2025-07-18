"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal, PlusCircle, ListPlus } from "lucide-react";
import type { Song } from "../lib/types";
import { usePlayerStore } from "../hooks/use-player-store";
import { usePlaylists } from '../context/PlaylistContext';
import { useState } from 'react';
import { useToast } from "../hooks/use-toast";

export function SongActions({ song }: { song: Song }) {
  const { addItemToQueueNext } = usePlayerStore();
  const { toast } = useToast();
  const { playlists, addSongToPlaylist, addPlaylist } = usePlaylists();
  const [showCreate, setShowCreate] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItemToQueueNext(song);
    toast({
      title: "Added to queue",
      description: `"${song.title}" will play next.`,
    });
  };
  
  const handleAddToPlaylist = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    addSongToPlaylist(playlistId, song);
    const playlist = playlists.find(p => p.id === playlistId);
    toast({
      title: playlist ? `Song Added` : 'Song Added',
      description: playlist ? `"${song.title}" was added to "${playlist.name}".` : `Song added to playlist.`,
    });
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName.trim(),
      songs: [song],
    };
    addPlaylist(newPlaylist);
    toast({
      title: 'Playlist Created',
      description: `"${newPlaylist.name}" has been created and the song was added.`,
    });
    setShowCreate(false);
    setNewPlaylistName('');
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={(v) => { setOpen(v); if (!v) setShowCreate(false); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options for {song.title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={handleAddToQueue}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Add to queue</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ListPlus className="mr-2 h-4 w-4" />
            <span>Add to playlist</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuLabel>Select a playlist</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {playlists.map((playlist) => (
              <DropdownMenuItem key={playlist.id} onClick={(e) => handleAddToPlaylist(e, playlist.id)}>
                {playlist.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {showCreate ? (
              <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-2 p-2">
                <input
                  autoFocus
                  className="border rounded px-2 py-1 text-sm bg-background text-foreground"
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  onClick={e => e.stopPropagation()}
                />
                <button type="submit" className="bg-accent text-accent-foreground rounded px-2 py-1 text-xs">Create</button>
              </form>
            ) : (
              <DropdownMenuItem onSelect={e => { e.preventDefault(); setShowCreate(true); }}>
                + Create new playlist
              </DropdownMenuItem>
            )}
            {playlists.length === 0 && !showCreate && <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
