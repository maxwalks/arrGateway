import type { SonarrSeries, SonarrDiskSpace } from "@/types/sonarr";

const BASE_URL = process.env.SONARR_URL ?? "http://192.168.0.149:8989";
const API_KEY = process.env.SONARR_API ?? "";

function sonarrFetch(path: string, init?: RequestInit) {
  return fetch(`${BASE_URL}/api/v3${path}`, {
    ...init,
    headers: {
      "X-Api-Key": API_KEY,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export async function getSeries(): Promise<SonarrSeries[]> {
  const res = await sonarrFetch("/series");
  if (!res.ok) throw new Error(`Sonarr /series failed: ${res.status}`);
  return res.json();
}

export async function getSeriesById(id: number): Promise<SonarrSeries> {
  const res = await sonarrFetch(`/series/${id}`);
  if (!res.ok) throw new Error(`Sonarr /series/${id} failed: ${res.status}`);
  return res.json();
}

export async function deleteSeries(id: number): Promise<void> {
  const res = await sonarrFetch(
    `/series/${id}?deleteFiles=true&addImportExclusion=false`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(`Sonarr DELETE /series/${id} failed: ${res.status}`);
}

export async function getDiskSpace(): Promise<SonarrDiskSpace[]> {
  const res = await sonarrFetch("/diskspace");
  if (!res.ok) throw new Error(`Sonarr /diskspace failed: ${res.status}`);
  return res.json();
}
