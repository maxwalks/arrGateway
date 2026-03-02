import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSeriesById } from "@/lib/api/sonarr";
import { hasPermission } from "@/lib/permissions";
import SeriesDetail from "@/components/series/SeriesDetail";
import Topbar from "@/components/layout/Topbar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [series, { data: { user } }] = await Promise.all([
    getSeriesById(Number(id)).catch(() => null),
    supabase.auth.getUser(),
  ]);

  if (!series || !user) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const canDelete = profile ? hasPermission(profile, "delete_series") : false;

  return (
    <>
      <Topbar
        title={series.title}
        actions={
          <Link
            href="/series"
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
        }
      />
      <SeriesDetail series={series} canDelete={canDelete} />
    </>
  );
}
