import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { SonarrSeries } from "@/types/sonarr";

function statusBadge(series: SonarrSeries) {
  const pct = series.statistics.percentOfEpisodes;
  if (pct === 100) return <Badge variant="lime">Complete</Badge>;
  if (pct > 0) return <Badge variant="amber">{Math.round(pct)}%</Badge>;
  if (series.monitored) return <Badge variant="purple">Monitored</Badge>;
  return <Badge variant="muted">Unmonitored</Badge>;
}

export default function SeriesCard({ series }: { series: SonarrSeries }) {
  const poster =
    series.remotePoster ??
    series.images.find((i) => i.coverType === "poster")?.remoteUrl;

  return (
    <Link href={`/series/${series.id}`}>
      <Card
        accent="lime"
        className="group overflow-hidden hover:border-accent-lime/60 transition-colors cursor-pointer h-full"
      >
        <div className="aspect-[2/3] relative bg-surface overflow-hidden">
          {poster ? (
            <Image
              src={poster}
              alt={series.title}
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
            {series.title}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-muted">
              {series.statistics.seasonCount}S
            </span>
            {statusBadge(series)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
