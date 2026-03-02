import type { RadarrMovie, RadarrDiskSpace } from "@/types/radarr";

const BASE_URL = process.env.RADARR_URL ?? "http://192.168.0.149:7878";
const API_KEY = process.env.RADARR_API ?? "";

function radarrFetch(path: string, init?: RequestInit) {
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

export async function getMovies(): Promise<RadarrMovie[]> {
  const res = await radarrFetch("/movie");
  if (!res.ok) throw new Error(`Radarr /movie failed: ${res.status}`);
  return res.json();
}

export async function getMovie(id: number): Promise<RadarrMovie> {
  const res = await radarrFetch(`/movie/${id}`);
  if (!res.ok) throw new Error(`Radarr /movie/${id} failed: ${res.status}`);
  return res.json();
}

export async function deleteMovie(id: number): Promise<void> {
  const res = await radarrFetch(
    `/movie/${id}?deleteFiles=true&addImportExclusion=false`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(`Radarr DELETE /movie/${id} failed: ${res.status}`);
}

export async function getDiskSpace(): Promise<RadarrDiskSpace[]> {
  const res = await radarrFetch("/diskspace");
  if (!res.ok) throw new Error(`Radarr /diskspace failed: ${res.status}`);
  return res.json();
}
