export interface Song {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  album: {
    id: string;
    title: string;
    cover: string;
  };
  duration: number; // in seconds
  src: string; // path to audio file
}

export interface Album {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
  };
  cover: string;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  albums: Album[];
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  audiobook: {
    id: string;
    title: string;
    cover: string;
    author: {
      id: string;
      name: string;
    };
  };
  duration: number; // in seconds
  src: string; // path to audio file
}

export interface Audiobook {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  cover: string;
  chapters: Chapter[];
  description?: string;
}
