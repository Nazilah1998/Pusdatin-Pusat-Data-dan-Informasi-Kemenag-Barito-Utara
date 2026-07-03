"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import type { User, AppPermission } from "@/types";

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "operator", label: "Operator" },
  { value: "viewer", label: "Viewer" },
];

const appOptions = [
  { id: "ptsp", name: "PTSP" },
  { id: "e_arsip", name: "E-Arsip" },
  { id: "e_surat", name: "E-Surat" },
  { id: "website", name: "Website Utama" },
  { id: "inklusi", name: "Inklusi" },
  { id: "bot", name: "Bot Kemenag" },
  { id: "loket", name: "Loket PTSP" },
];

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, loading }: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "viewer");
  const [status, setStatus] = useState<"active" | "inactive">(
    initialData?.status || "active",
  );
  const [appPermissions, setAppPermissions] = useState<AppPermission[]>(
    initialData?.appPermissions ||
      appOptions.map((app) => ({
        appId: app.id,
        appName: app.name,
        role: "none" as const,
      })),
  );

  const handleAppRoleChange = (appId: string, appRole: AppPermission["role"]) => {
    setAppPermissions((prev) =>
      prev.map((p) => (p.appId === appId ? { ...p, role: appRole } : p)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      ...(password ? { password } : {}),
      role,
      status,
      appPermissions: appPermissions.filter((p) => p.role !== "none"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label={initialData ? "Password (kosongkan jika tidak diubah)" : "Password"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initialData}
        />
        <Select
          id="role"
          label="Role Global"
          options={roleOptions}
          value={role}
          onChange={(e) => setRole(e.target.value as User["role"])}
        />
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          checked={status === "active"}
          onChange={(checked) => setStatus(checked ? "active" : "inactive")}
          label="Akun Aktif"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Hak Akses per Aplikasi (RBAC)
        </label>
        <div className="space-y-2 rounded-lg border border-slate-200 p-4">
          {appPermissions.map((perm) => (
            <div
              key={perm.appId}
              className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-slate-700">
                {perm.appName}
              </span>
              <div className="flex items-center gap-1">
                {(["none", "viewer", "operator"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleAppRoleChange(perm.appId, r)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                      perm.role === r
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {r === "none" ? "Tidak" : r === "viewer" ? "Viewer" : "Operator"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? "Simpan Perubahan" : "Tambah Pengguna"}
        </Button>
      </div>
    </form>
  );
}
