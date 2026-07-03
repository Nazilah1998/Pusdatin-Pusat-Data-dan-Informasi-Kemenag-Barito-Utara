"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AppGrid } from "@/components/apps/AppGrid";
import { useApps, useToggleMaintenance, useSystemHealth } from "@/hooks/use-apps";
import { toast } from "@/components/ui/Toast";
import type { SateliteApp } from "@/types";
import { Cpu, HardDrive, MemoryStick } from "lucide-react";

export default function AppsPage() {
  const { data: apps, isLoading } = useApps();
  const toggleMutation = useToggleMaintenance();
  const { data: health } = useSystemHealth();

  const handleToggle = async (appId: string, status: SateliteApp["status"]) => {
    try {
      await toggleMutation.mutateAsync({ appId, status });
      toast("success", `Status aplikasi berhasil diubah`);
    } catch {
      toast("error", "Gagal mengubah status aplikasi");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pusat Kendali Aplikasi</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola status operasional dan pantau kesehatan sistem
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <ProgressBar
                  label="CPU"
                  value={health?.cpu ?? 0}
                  variant={
                    (health?.cpu ?? 0) > 80
                      ? "danger"
                      : (health?.cpu ?? 0) > 60
                        ? "warning"
                        : "default"
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <MemoryStick className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <ProgressBar
                  label="RAM"
                  value={health?.ram ?? 0}
                  variant={
                    (health?.ram ?? 0) > 80
                      ? "danger"
                      : (health?.ram ?? 0) > 60
                        ? "warning"
                        : "default"
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <HardDrive className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <ProgressBar
                  label="Penyimpanan"
                  value={health?.storage ?? 0}
                  variant={
                    (health?.storage ?? 0) > 80
                      ? "danger"
                      : (health?.storage ?? 0) > 60
                        ? "warning"
                        : "default"
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-900">Status Aplikasi Satelit</h3>
        </CardHeader>
        <CardBody>
          <AppGrid
            apps={apps}
            loading={isLoading}
            onToggle={handleToggle}
          />
        </CardBody>
      </Card>
    </div>
  );
}
