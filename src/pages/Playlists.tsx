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
    <div className="p-3 md:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Playlists</h1>
        <CreatePlaylistDialog onPlaylistCreated={handlePlaylistCreated} />
      </div>
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {playlists.map(playlist => (
            <Card key={playlist.id} className="flex flex-col p-2 gap-2">
              <CardHeader className="p-2 pb-0 flex items-center gap-2">
                <div className="p-2 bg-muted rounded-md">
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{playlist.name}</CardTitle>
                  <CardDescription className="text-xs">{playlist.songs.length} songs</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-2 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">{playlist.description}</p>
              </CardContent>
              <CardFooter className="p-2 pt-0">
                <Button variant="outline" className="w-full text-xs py-1" onClick={() => navigate(`/playlists/${playlist.id}`)}>View Playlist</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <h2 className="text-base font-semibold mb-1">No playlists yet</h2>
          <p className="text-xs text-muted-foreground">Create your first playlist to get started.</p>
        </div>
      )}
    </div>
  );
} 