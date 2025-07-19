import { audiobooks } from '../lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Link } from 'react-router-dom';

export default function Audiobooks() {
  return (
    <div className="flex-1 space-y-3 p-3 md:p-5 pt-4">
      <div className="flex items-center justify-between space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Audiobooks ({audiobooks.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {audiobooks.map((book) => (
            <Link key={book.id} to={`/audiobooks/${book.id}`}>
              <Card className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col p-2 gap-2">
                <div className="relative aspect-square bg-gray-700">
                  <img src={book.cover} alt={book.title} className="object-cover w-full h-full rounded-md" />
                </div>
                <CardHeader className="p-2 flex-grow">
                  <CardTitle className="truncate font-headline text-sm font-semibold">{book.title}</CardTitle>
                  <CardDescription className="truncate text-xs">{book.author.name}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {audiobooks.length === 0 && (
            <p className="col-span-full text-xs text-gray-400">No audiobooks found in your library.</p>
          )}
        </div>
      </section>
    </div>
  );
} 