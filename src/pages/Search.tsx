import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { useMusic } from '../context/MusicContext';
import { Play } from 'lucide-react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const { songs, isLoading } = useMusic();

  if (isLoading) {
    return <div className="p-8 text-white">Loading...</div>;
  }

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Search</h2>
      </div>
      
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Search songs, artists, or albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        
        {searchQuery && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Results ({filteredSongs.length})
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredSongs.map((song) => (
                <Card key={song.id} className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col group">
                  <div className="relative aspect-square bg-gray-700">
                    <img
                      src={song.album?.cover || '/placeholder-cover.png'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play className="h-6 w-6 text-gray-900 fill-current" />
                      </div>
                    </div>
                  </div>
                  <CardHeader className="p-4 flex-grow">
                    <CardTitle className="font-headline text-sm" style={{ height: '2.8em', lineHeight: '1.4em', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</CardTitle>
                    <div className="text-xs text-muted-foreground truncate w-full">{song.artist?.name || 'Unknown Artist'}</div>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            {filteredSongs.length === 0 && (
              <p className="text-muted-foreground">No results found for "{searchQuery}".</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 