import MovieCard from "./MovieCard";
import type { RadarrMovie } from "@/types/radarr";

export default function MovieGrid({ movies }: { movies: RadarrMovie[] }) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-24 text-text-muted">
        No movies found in Radarr.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
