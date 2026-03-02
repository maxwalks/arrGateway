import Link from "next/link";
import { Film, Tv2 } from "lucide-react";
import { getMovies } from "@/lib/api/radarr";
import { getSeries } from "@/lib/api/sonarr";
import Topbar from "@/components/layout/Topbar";
import Card from "@/components/ui/Card";
import StorageWidget from "@/components/storage/StorageWidget";
import ActiveDownloadsSummary from "@/components/downloads/ActiveDownloadsSummary";

export default async function DashboardPage() {
  const [movies, series] = await Promise.all([
    getMovies().catch(() => []),
    getSeries().catch(() => []),
  ]);

  const downloadedMovies = movies.filter((m) => m.hasFile).length;
  const completeSeries = series.filter(
    (s) => s.statistics.percentOfEpisodes === 100
  ).length;

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-6 space-y-6 max-w-5xl">

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/movies">
            <Card accent="purple" className="p-5 hover:border-accent-purple/60 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <Film size={16} className="text-accent-purple" />
                <span className="text-sm font-semibold text-text-primary">Movies</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">{movies.length}</p>
              <p className="text-xs text-text-muted mt-1">
                {downloadedMovies} downloaded
              </p>
            </Card>
          </Link>

          <Link href="/series">
            <Card accent="lime" className="p-5 hover:border-accent-lime/60 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <Tv2 size={16} className="text-accent-lime" />
                <span className="text-sm font-semibold text-text-primary">Series</span>
              </div>
              <p className="text-3xl font-bold text-text-primary">{series.length}</p>
              <p className="text-xs text-text-muted mt-1">
                {completeSeries} complete
              </p>
            </Card>
          </Link>
        </div>

        {/* Storage + downloads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StorageWidget />
          <ActiveDownloadsSummary />
        </div>

      </div>
    </>
  );
}
