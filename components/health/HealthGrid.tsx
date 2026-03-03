"use client";

import useSWR from "swr";
import HealthCard from "./HealthCard";
import Spinner from "@/components/ui/Spinner";
import type { ServiceHealth } from "@/lib/api/uptimekuma";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HealthGrid() {
  const { data, error, isLoading } = useSWR<ServiceHealth[]>(
    "/api/health",
    fetcher,
    { refreshInterval: 30_000 }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-24 text-red-400 text-sm">
        Failed to connect to Uptime Kuma.
      </div>
    );
  }

  const upCount = data.filter((s) => s.status === "up").length;

  // Group services by groupName, preserving order from API
  const groups = data.reduce<{ name: string; services: ServiceHealth[] }[]>(
    (acc, service) => {
      const existing = acc.find((g) => g.name === service.groupName);
      if (existing) {
        existing.services.push(service);
      } else {
        acc.push({ name: service.groupName, services: [service] });
      }
      return acc;
    },
    []
  );

  return (
    <div className="space-y-8">
      <p className="text-xs text-text-muted">
        {upCount}/{data.length} services up · refreshes every 30s
      </p>
      {groups.map((group) => (
        <div key={group.name}>
          <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-3">
            {group.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.services.map((service) => (
              <HealthCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
