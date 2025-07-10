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
import { playlists } from "../lib/mock-data";
import { useToast } from "../hooks/use-toast";

export function SongActions({ song }: { song: Song }) {
  const { addItemToQueueNext } = usePlayerStore();
  const { toast } = useToast();

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
    // In a real app, this would be an API call.
    // Here we are modifying mock data.
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      // Avoid adding duplicates
      if (!playlist.songs.find(s => s.id === song.id)) {
        playlist.songs.push(song);
        toast({
          title: "Song Added",
          description: `"${song.title}" was added to "${playlist.name}".`,
        });
      } else {
        toast({
          title: "Already in playlist",
          description: `"${song.title}" is already in "${playlist.name}".`,
        });
      }
    }
  };

  return (
    <DropdownMenu>
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
            {playlists.length === 0 && <DropdownMenuItem disabled>No playlists found</DropdownMenuItem>}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
