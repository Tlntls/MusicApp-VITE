import type { Artist, Album, Song, Playlist, Audiobook, Chapter } from './types';

const ARTIST_1 = { id: 'artist-1', name: 'Cosmic Echoes' };
const ARTIST_2 = { id: 'artist-2', name: 'Starlight Serenade' };

const ALBUM_1: Omit<Album, 'songs' | 'artist'> = {
  id: 'album-1',
  title: 'Galactic Drift',
  cover: 'https://placehold.co/300x300.png',
};

const ALBUM_2: Omit<Album, 'songs' | 'artist'> = {
  id: 'album-2',
  title: 'Neon Moons',
  cover: 'https://placehold.co/300x300.png',
};

const ALBUM_3: Omit<Album, 'songs' | 'artist'> = {
    id: 'album-3',
    title: 'Echoes of Andromeda',
    cover: 'https://placehold.co/300x300.png',
};

const SONGS_ALBUM_1: Song[] = [
  { id: 'song-1-1', title: 'Orion\'s Belt', duration: 245, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_1.id, title: ALBUM_1.title, cover: ALBUM_1.cover } },
  { id: 'song-1-2', title: 'Solar Flares', duration: 190, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_1.id, title: ALBUM_1.title, cover: ALBUM_1.cover } },
  { id: 'song-1-3', title: 'Zero Gravity', duration: 210, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_1.id, title: ALBUM_1.title, cover: ALBUM_1.cover } },
  { id: 'song-1-4', title: 'Kuiper Dance', duration: 185, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_1.id, title: ALBUM_1.title, cover: ALBUM_1.cover } },
];

const SONGS_ALBUM_2: Song[] = [
  { id: 'song-2-1', title: 'City Lights', duration: 220, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_2.id, title: ALBUM_2.title, cover: ALBUM_2.cover } },
  { id: 'song-2-2', title: 'Midnight Drive', duration: 200, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_2.id, title: ALBUM_2.title, cover: ALBUM_2.cover } },
  { id: 'song-2-3', title: 'Reflections in Rain', duration: 250, src: '/music/placeholder.mp3', artist: ARTIST_1, album: { id: ALBUM_2.id, title: ALBUM_2.title, cover: ALBUM_2.cover } },
];

const SONGS_ALBUM_3: Song[] = [
    { id: 'song-3-1', title: 'Andromeda\'s lullaby', duration: 180, src: '/music/placeholder.mp3', artist: ARTIST_2, album: { id: ALBUM_3.id, title: ALBUM_3.title, cover: ALBUM_3.cover } },
    { id: 'song-3-2', title: 'Cassiopeia\'s Dream', duration: 215, src: '/music/placeholder.mp3', artist: ARTIST_2, album: { id: ALBUM_3.id, title: ALBUM_3.title, cover: ALBUM_3.cover } },
]

export const albums: Album[] = [
  { ...ALBUM_1, artist: ARTIST_1, songs: SONGS_ALBUM_1 },
  { ...ALBUM_2, artist: ARTIST_1, songs: SONGS_ALBUM_2 },
  { ...ALBUM_3, artist: ARTIST_2, songs: SONGS_ALBUM_3 },
];

export const artists: Artist[] = [
  { ...ARTIST_1, albums: [albums[0], albums[1]] },
  { ...ARTIST_2, albums: [albums[2]] },
];

export const songs: Song[] = [...SONGS_ALBUM_1, ...SONGS_ALBUM_2, ...SONGS_ALBUM_3];

export const playlists: Playlist[] = [
    {
        id: 'playlist-1',
        name: 'Late Night Coding',
        description: 'Deep focus electronic music for staying in the zone.',
        songs: [SONGS_ALBUM_1[0], SONGS_ALBUM_1[2], SONGS_ALBUM_2[1], SONGS_ALBUM_2[2]]
    }
];

const AUTHOR_1 = { id: 'author-1', name: 'Jules Verne' };
const AUDIOBOOK_1: Omit<Audiobook, 'chapters' | 'author'> = {
  id: 'audiobook-1',
  title: '20,000 Leagues Under the Sea',
  cover: 'https://placehold.co/300x300.png',
  description: 'A classic science fiction adventure novel telling the story of Captain Nemo and his submarine Nautilus.'
};

const CHAPTERS_AUDIOBOOK_1: Chapter[] = [
  { id: 'ch-1-1', title: 'A Runaway Reef', chapterNumber: 1, duration: 1800, src: '/music/placeholder.mp3', audiobook: { id: AUDIOBOOK_1.id, title: AUDIOBOOK_1.title, cover: AUDIOBOOK_1.cover, author: AUTHOR_1 } },
  { id: 'ch-1-2', title: 'The Pros and Cons', chapterNumber: 2, duration: 2200, src: '/music/placeholder.mp3', audiobook: { id: AUDIOBOOK_1.id, title: AUDIOBOOK_1.title, cover: AUDIOBOOK_1.cover, author: AUTHOR_1 } },
  { id: 'ch-1-3', title: 'I Form My Resolution', chapterNumber: 3, duration: 950, src: '/music/placeholder.mp3', audiobook: { id: AUDIOBOOK_1.id, title: AUDIOBOOK_1.title, cover: AUDIOBOOK_1.cover, author: AUTHOR_1 } },
];

export const audiobooks: Audiobook[] = [
    {...AUDIOBOOK_1, author: AUTHOR_1, chapters: CHAPTERS_AUDIOBOOK_1}
];

export const chapters: Chapter[] = [...CHAPTERS_AUDIOBOOK_1];
