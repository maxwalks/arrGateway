const BASE = process.env.UPTIME_KUMA_URL ?? "http://192.168.0.149:3001";
const SLUG = process.env.UPTIME_KUMA_SLUG ?? "arr";

interface UKMonitor {
  id: number;
  name: string;
  type: string;
}

interface UKGroup {
  id: number;
  name: string;
  weight: number;
  monitorList: UKMonitor[];
}

interface UKStatusPageResponse {
  config: { title: string; slug: string };
  publicGroupList: UKGroup[];
}

interface UKHeartbeat {
  status: 0 | 1;
  time: string; // "2026-03-03 09:52:10.913" — space-separated, not ISO T
  ping: number | null;
  msg: string;
}

interface UKHeartbeatResponse {
  heartbeatList: Record<string, UKHeartbeat[]>; // oldest→newest; take last element
  uptimeList: Record<string, number>; // keys: "1_24", "1_720"
}

export interface ServiceHealth {
  id: number;
  name: string;
  groupName: string;
  status: "up" | "down" | "unknown";
  ping: number | null;
  uptime24h: number | null;
  uptime30d: number | null;
  lastChecked: string | null; // normalized ISO string
  heartbeats: { status: 0 | 1; ping: number | null }[]; // oldest→newest
}

async function ukFetch(path: string): Promise<Response> {
  return fetch(`${BASE}${path}`, { cache: "no-store" });
}

async function getStatusPage(): Promise<UKStatusPageResponse> {
  const res = await ukFetch(`/api/status-page/${SLUG}`);
  if (!res.ok) throw new Error(`Uptime Kuma status page failed: ${res.status}`);
  return res.json();
}

async function getHeartbeats(): Promise<UKHeartbeatResponse> {
  const res = await ukFetch(`/api/status-page/heartbeat/${SLUG}`);
  if (!res.ok) throw new Error(`Uptime Kuma heartbeat failed: ${res.status}`);
  return res.json();
}

export async function getServiceHealth(): Promise<ServiceHealth[]> {
  const [page, beats] = await Promise.all([getStatusPage(), getHeartbeats()]);

  const services: ServiceHealth[] = [];

  for (const group of page.publicGroupList) {
    for (const monitor of group.monitorList) {
      const list = beats.heartbeatList[String(monitor.id)] ?? [];
      const hb = list.length > 0 ? list[list.length - 1] : null;

      services.push({
        id: monitor.id,
        name: monitor.name,
        groupName: group.name,
        status: hb == null ? "unknown" : hb.status === 1 ? "up" : "down",
        ping: hb?.ping ?? null,
        uptime24h: beats.uptimeList[`${monitor.id}_24`] ?? null,
        uptime30d: beats.uptimeList[`${monitor.id}_720`] ?? null,
        lastChecked: hb ? hb.time.replace(" ", "T") : null,
        heartbeats: list.map((h) => ({ status: h.status, ping: h.ping })),
      });
    }
  }

  return services;
}
