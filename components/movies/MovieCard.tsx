import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { RadarrMovie } from "@/types/radarr";

function statusBadge(movie: RadarrMovie) {
  if (movie.hasFile) return <Badge variant="lime">Downloaded</Badge>;
  if (movie.monitored) return <Badge variant="amber">Monitored</Badge>;
  return <Badge variant="muted">Unmonitored</Badge>;
}

export default function MovieCard({ movie }: { movie: RadarrMovie }) {
  const poster =
    movie.remotePoster ??
    movie.images.find((i) => i.coverType === "poster")?.remoteUrl;

  return (
    <Link href={`/movies/${movie.id}`}>
      <Card
        accent="purple"
        className="group overflow-hidden hover:border-accent-purple/60 transition-colors cursor-pointer h-full"
      >
        <div className="aspect-[2/3] relative bg-surface overflow-hidden">
          {poster ? (
            <Image
              src={poster}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
              No poster
            </div>
          )}
        </div>
        <div className="p-3 space-y-1.5">
          <p className="text-sm font-semibold text-text-primary leading-tight line-clamp-2">
            {movie.title}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-muted">{movie.year}</span>
            {statusBadge(movie)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
