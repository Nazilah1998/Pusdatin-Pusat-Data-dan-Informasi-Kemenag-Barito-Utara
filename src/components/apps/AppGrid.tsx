"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SateliteApp } from "@/types";
import { Globe, ExternalLink } from "lucide-react";

const appIcons: Record<string, string> = {
  ptsp: "PTSP",
  e_arsip: "E-Arsip",
  e_surat: "E-Surat",
  website: "Web",
  inklusi: "Inklusi",
  bot: "Bot",
  loket: "Loket",
};

const statusBadge: Record<string, "success" | "warning" | "danger"> = {
  online: "success",
  maintenance: "warning",
  degraded: "danger",
};

const statusLabel: Record<string, string> = {
  online: "Online",
  maintenance: "Pemeliharaan",
  degraded: "Gangguan",
};

interface AppGridProps {
  apps?: SateliteApp[];
  loading?: boolean;
  onToggle: (appId: string, status: SateliteApp["status"]) => void;
}

export function AppGrid({ apps, loading, onToggle }: AppGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i}>
            <CardBody>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="mt-2 h-4 w-32" />
              <Skeleton className="mt-4 h-5 w-12" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (!apps?.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-slate-500">
        Tidak ada aplikasi
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {apps.map((app) => (
        <Card key={app.id}>
          <CardBody>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                  {appIcons[app.id] || app.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{app.name}</h3>
                  <p className="text-xs text-slate-500">{app.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge variant={statusBadge[app.status]}>
                {statusLabel[app.status]}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  {app.status === "online" ? "Online" : "Maintenance"}
                </span>
                <Toggle
                  checked={app.status === "online"}
                  onChange={(checked) =>
                    onToggle(app.id, checked ? "online" : "maintenance")
                  }
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Schema: {app.schema}</span>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Buka
              </a>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
