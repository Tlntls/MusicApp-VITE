import { audiobooks } from '../lib/mock-data';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Link } from 'react-router-dom';

export default function Audiobooks() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Audiobooks ({audiobooks.length})</h2>
      </div>
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {audiobooks.map((book) => (
            <Link key={book.id} to={`/audiobooks/${book.id}`}>
              <Card className="w-full h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col">
                <div className="relative aspect-square bg-gray-700">
                  {/* Placeholder for Book Cover Art */}
                  <img src={book.cover} alt={book.title} className="object-cover w-full h-full" />
                </div>
                <CardHeader className="p-4 flex-grow">
                  <CardTitle className="truncate font-headline">{book.title}</CardTitle>
                  <CardDescription className="truncate">{book.author.name}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {audiobooks.length === 0 && (
            <p className="col-span-full text-gray-400">No audiobooks found in your library.</p>
          )}
        </div>
      </section>
    </div>
  );
} 