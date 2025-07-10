"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import type { Playlist } from "../lib/types";
import { useToast } from "../hooks/use-toast";

export function CreatePlaylistDialog({ onPlaylistCreated }: { onPlaylistCreated: (playlist: Playlist) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        toast({
            title: "Error",
            description: "Playlist name is required.",
            variant: "destructive"
        });
        return;
    }

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      songs: [],
    };

    onPlaylistCreated(newPlaylist);
    
    toast({
        title: "Playlist Created",
        description: `"${newPlaylist.name}" has been created.`,
    });

    // Reset form and close dialog
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Create a new playlist</DialogTitle>
            <DialogDescription>
                Give your new playlist a name and an optional description.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" placeholder="Optional description..." />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Save playlist</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
