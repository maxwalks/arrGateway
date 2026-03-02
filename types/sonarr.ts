export interface SonarrSeries {
  id: number;
  title: string;
  year: number;
  overview: string;
  status: string;
  network: string;
  genres: string[];
  monitored: boolean;
  remotePoster?: string;
  images: { coverType: string; remoteUrl: string }[];
  ratings: { imdb?: { value: number }; tmdb?: { value: number } };
  statistics: {
    seasonCount: number;
    episodeCount: number;
    episodeFileCount: number;
    sizeOnDisk: number;
    percentOfEpisodes: number;
  };
  seasons: {
    seasonNumber: number;
    monitored: boolean;
    statistics: {
      episodeCount: number;
      episodeFileCount: number;
      sizeOnDisk: number;
      percentOfEpisodes: number;
    };
  }[];
  added: string;
}

export interface SonarrDiskSpace {
  path: string;
  label: string;
  freeSpace: number;
  totalSpace: number;
}
