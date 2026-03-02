export interface RadarrMovie {
  id: number;
  title: string;
  originalTitle: string;
  year: number;
  overview: string;
  runtime: number;
  genres: string[];
  status: string;
  hasFile: boolean;
  isAvailable: boolean;
  monitored: boolean;
  remotePoster?: string;
  images: { coverType: string; remoteUrl: string }[];
  ratings: { imdb?: { value: number }; tmdb?: { value: number } };
  movieFile?: {
    id: number;
    size: number;
    quality: { quality: { name: string } };
    mediaInfo?: { videoCodec: string; audioCodec: string };
  };
  sizeOnDisk: number;
  added: string;
}

export interface RadarrDiskSpace {
  path: string;
  label: string;
  freeSpace: number;
  totalSpace: number;
}
