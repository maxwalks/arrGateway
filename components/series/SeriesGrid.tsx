import SeriesCard from "./SeriesCard";
import type { SonarrSeries } from "@/types/sonarr";

export default function SeriesGrid({ series }: { series: SonarrSeries[] }) {
  if (series.length === 0) {
    return (
      <div className="text-center py-24 text-text-muted">
        No series found in Sonarr.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {series.map((s) => (
        <SeriesCard key={s.id} series={s} />
      ))}
    </div>
  );
}
