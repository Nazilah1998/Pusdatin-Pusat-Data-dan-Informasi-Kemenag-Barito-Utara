"use client";

import { useState, useRef } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { Skeleton } from "@/components/ui/Skeleton";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { SateliteApp } from "@/types";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Edit2,
  Server,
  Database,
  Globe,
  Upload,
} from "lucide-react";
import { useUpdateApp } from "@/hooks/use-apps";
import { toast } from "@/components/ui/Toast";

const parseIconUrl = (iconStr: string | null) => {
  if (!iconStr) return { url: "", scale: 50 };
  const [url, query] = iconStr.split("?");
  let scale = 50;
  if (query) {
    const params = new URLSearchParams(query);
    if (params.has("scale")) {
      scale = parseInt(params.get("scale")!, 10);
    }
  }
  return { url, scale };
};

const buildIconUrl = (url: string, scale: number) => {
  if (!url) return "";
  const base = url.split("?")[0];
  return `${base}?scale=${scale}`;
};

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

export function AppGrid({
  apps,
  loading,
  onToggle,
}: {
  apps: SateliteApp[];
  loading?: boolean;
  onToggle: (id: string, status: "online" | "maintenance") => void;
}) {
  const [editingApp, setEditingApp] = useState<SateliteApp | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<{ id: string; status: "online" | "maintenance"; appName: string } | null>(null);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {apps.map((app, index) => {
          const localhostPorts = Array.from({ length: 5 }, (_, i) => 3001 + i);
          const dropdownItems = localhostPorts.map((port) => ({
            label: `Localhost:${port}`,
            icon: <Server className="h-3 w-3" />,
            onClick: () => {
              window.open(`http://localhost:${port}`, "_blank");
            },
          }));

          return (
            <Card
              key={app.id}
              className="group relative z-0 hover:z-10 focus-within:z-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 border-slate-200/60"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" />

              <CardBody className="relative flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-sm font-bold text-emerald-700 shadow-inner ring-1 ring-emerald-200/50 transition-transform duration-300 group-hover:scale-110 overflow-hidden">
                      {app.icon ? (
                        <img
                          src={parseIconUrl(app.icon).url}
                          alt={app.name}
                          className="h-full w-full object-contain"
                          style={{ transform: `scale(${parseIconUrl(app.icon).scale / 100})` }}
                        />
                      ) : (
                        appIcons[app.id] || app.name[0]
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-emerald-700">
                        {app.name}
                      </h3>
                      <p className="line-clamp-1 text-xs font-medium text-slate-500">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingApp(app)}
                    className="shrink-0 rounded-full bg-slate-50 p-2 text-slate-400 opacity-0 ring-1 ring-slate-200/50 transition-all hover:bg-emerald-50 hover:text-emerald-600 hover:ring-emerald-200 group-hover:opacity-100"
                    title="Edit Aplikasi"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 mb-5 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-[11px] text-slate-600">
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                      <Database className="h-3.5 w-3.5" />
                      Schema DB
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="truncate font-medium text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-100"
                        title={app.schemaName || app.schema}
                      >
                        {app.schemaName || app.schema}
                      </span>
                      {app.schemaUrl && (
                        <a
                          href={app.schemaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors"
                          title="Buka Schema URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-500">
                      <Globe className="h-3.5 w-3.5" />
                      URL Website
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="truncate font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50"
                        title={app.url || ""}
                      >
                        {app.url ? new URL(app.url).hostname : "Belum diatur"}
                      </span>
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors"
                          title="Buka Link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          app.status === "online"
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-amber-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-bold",
                          app.status === "online"
                            ? "text-emerald-700"
                            : "text-amber-700",
                        )}
                      >
                        {app.status === "online"
                          ? "Mode Online"
                          : "Maintenance"}
                      </span>
                    </div>
                    <Toggle
                      checked={app.status === "online"}
                      onChange={(checked) =>
                        setConfirmToggle({
                          id: app.id,
                          status: checked ? "online" : "maintenance",
                          appName: app.name,
                        })
                      }
                    />
                  </div>

                  <Dropdown
                    trigger={
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800">
                        Buka di local
                        <Server className="h-3.5 w-3.5" />
                      </button>
                    }
                    items={dropdownItems}
                    position={index >= apps.length - 3 ? "top" : "bottom"}
                  />
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {editingApp && (
        <EditAppModal app={editingApp} onClose={() => setEditingApp(null)} />
      )}

      <Dialog
        open={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        title="Konfirmasi Perubahan Status"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Apakah Anda yakin ingin mengubah status aplikasi <strong>{confirmToggle?.appName}</strong> menjadi mode{" "}
            <strong className={confirmToggle?.status === "online" ? "text-emerald-600" : "text-amber-600"}>
              {confirmToggle?.status === "online" ? "Online" : "Maintenance"}
            </strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmToggle(null)}>
              Batal
            </Button>
            <Button
              className={confirmToggle?.status === "online" ? "" : "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"}
              onClick={() => {
                if (confirmToggle) {
                  onToggle(confirmToggle.id, confirmToggle.status);
                  setConfirmToggle(null);
                }
              }}
            >
              Ya, Ubah Status
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

function EditAppModal({
  app,
  onClose,
}: {
  app: SateliteApp;
  onClose: () => void;
}) {
  const updateMutation = useUpdateApp();
  const iconData = parseIconUrl(app.icon);
  const [formData, setFormData] = useState({
    name: app.name,
    description: app.description || "",
    url: app.url || "",
    schemaName: app.schemaName || app.schema || "",
    schemaUrl: app.schemaUrl || "",
    sortOrder: app.sortOrder?.toString() || "0",
    icon: iconData.url,
    iconScale: iconData.scale,
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size and type if needed
    if (file.size > 2 * 1024 * 1024) {
      toast("error", "Ukuran file maksimal 2MB");
      return;
    }

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Gagal upload");

      const result = await res.json();
      setFormData((prev) => ({ ...prev, icon: result.url, iconScale: 50 }));
      toast("success", "Logo berhasil diunggah");
    } catch (err) {
      console.error(err);
      toast("error", "Gagal mengunggah logo");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        appId: app.id,
        data: {
          name: formData.name,
          description: formData.description,
          url: formData.url,
          schemaName: formData.schemaName,
          schemaUrl: formData.schemaUrl,
          sortOrder: parseInt(formData.sortOrder, 10),
          icon: buildIconUrl(formData.icon, formData.iconScale),
        } as Partial<SateliteApp>,
      });
      toast("success", "Aplikasi berhasil diperbarui");
      onClose();
    } catch {
      toast("error", "Gagal memperbarui aplikasi");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} title="Edit Aplikasi Satelit">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nama Aplikasi
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Deskripsi Singkat
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 pt-6">
            <div className="h-20 w-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
              {formData.icon ? (
                <img
                  src={formData.icon}
                  alt="Logo"
                  className="h-full w-full object-contain"
                  style={{ transform: `scale(${formData.iconScale / 100})` }}
                />
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  No Logo
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={() => fileInputRef.current?.click()}
                  loading={isUploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 max-w-[100px] text-center">
              JPG/PNG/SVG
              <br />
              Max 2MB
            </span>
            {formData.icon && (
              <div className="w-full mt-1">
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={formData.iconScale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iconScale: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center text-[10px] text-slate-500 mt-1">
                  Ukuran: {formData.iconScale}%
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            URL Default (Online)
          </label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            type="url"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Schema DB
            </label>
            <Input
              value={formData.schemaName}
              onChange={(e) =>
                setFormData({ ...formData, schemaName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              URL Schema DB (Opsional)
            </label>
            <Input
              value={formData.schemaUrl}
              onChange={(e) =>
                setFormData({ ...formData, schemaUrl: e.target.value })
              }
              type="url"
              placeholder="https://supabase.com/..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Sort Order
            </label>
            <Input
              type="number"
              value={formData.sortOrder}
              onChange={(e) =>
                setFormData({ ...formData, sortOrder: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            loading={updateMutation.isPending || isUploading}
          >
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
