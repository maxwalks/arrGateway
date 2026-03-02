import type { QbTorrent } from "@/types/qbittorrent";

const BASE_URL = process.env.QBITTORRENT_URL ?? "http://192.168.0.149:8080";
const USERNAME = process.env.QBITTORRENT_USERNAME ?? "";
const PASSWORD = process.env.QBITTORRENT_PASSWORD ?? "";

// Module-level SID cache (per process — fine for single-container family app)
let sidCache: { sid: string; expiresAt: number } | null = null;

async function getSid(): Promise<string> {
  if (sidCache && Date.now() < sidCache.expiresAt) {
    return sidCache.sid;
  }

  const body = new URLSearchParams({ username: USERNAME, password: PASSWORD });
  const res = await fetch(`${BASE_URL}/api/v2/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`qBittorrent login failed: ${res.status}`);

  const text = await res.text();
  if (text.trim() === "Fails.") throw new Error("qBittorrent login rejected");

  const setCookie = res.headers.get("set-cookie") ?? "";
  const match = setCookie.match(/SID=([^;]+)/);
  if (!match) throw new Error("qBittorrent: no SID in response");

  sidCache = { sid: match[1], expiresAt: Date.now() + 28 * 60 * 1000 }; // 28 min
  return sidCache.sid;
}

async function qbFetch(path: string): Promise<Response> {
  const sid = await getSid();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Cookie: `SID=${sid}` },
    cache: "no-store",
  });

  // SID expired — clear cache and retry once
  if (res.status === 403) {
    sidCache = null;
    const freshSid = await getSid();
    return fetch(`${BASE_URL}${path}`, {
      headers: { Cookie: `SID=${freshSid}` },
      cache: "no-store",
    });
  }

  return res;
}

export async function getTorrents(): Promise<QbTorrent[]> {
  const res = await qbFetch("/api/v2/torrents/info");
  if (!res.ok) throw new Error(`qBittorrent /torrents/info failed: ${res.status}`);
  return res.json();
}
