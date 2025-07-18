import { usePlaylists } from '../context/PlaylistContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Music, Sparkles } from 'lucide-react';
import { CreatePlaylistDialog } from '../components/create-playlist-dialog';
import { useNavigate } from 'react-router-dom';

export default function Playlists() {
  const { playlists, addPlaylist } = usePlaylists();
  const handlePlaylistCreated = addPlaylist;
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
        <CreatePlaylistDialog onPlaylistCreated={handlePlaylistCreated} />
      </div>
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map(playlist => (
            <Card key={playlist.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-md">
                    <Music className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle>{playlist.name}</CardTitle>
                    <CardDescription>{playlist.songs.length} songs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate(`/playlists/${playlist.id}`)}>View Playlist</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-bold mb-2">No playlists yet</h2>
          <p className="text-muted-foreground">Create your first playlist to get started.</p>
        </div>
      )}
    </div>
  );
} 