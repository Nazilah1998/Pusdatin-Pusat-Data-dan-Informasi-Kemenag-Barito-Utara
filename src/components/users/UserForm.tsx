"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import type { User, AppPermission } from "@/types";
import { useApps } from "@/hooks/use-apps";

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
];

const userTypeOptions = [
  { value: "internal_admin", label: "Admin Internal" },
  { value: "internal_pegawai", label: "Pegawai Kemenag" },
  { value: "eksternal_masyarakat", label: "Masyarakat Umum" },
];



interface UserFormProps {
  initialData?: User;
  defaultUserType?: string;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function UserForm({ initialData, defaultUserType, onSubmit, onCancel, loading }: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialData?.role || "admin");
  const [userType, setUserType] = useState<User["userType"]>(initialData?.userType || (defaultUserType as User["userType"]) || "internal_admin");
  const [status, setStatus] = useState<"active" | "inactive">(
    initialData?.status || "active",
  );
  
  const { data: apps } = useApps();
  const [appPermissions, setAppPermissions] = useState<AppPermission[]>(
    initialData?.appPermissions || []
  );

  useEffect(() => {
    if (apps && apps.length > 0) {
      setAppPermissions((prev) => {
        const newPerms = apps.map((app) => {
          const existing = prev.find((p) => p.appId === app.id);
          return existing || { appId: app.id, appName: app.name, role: "none" as const, features: [] };
        });
        return newPerms;
      });
    }
  }, [apps]);

  const handleAppRoleChange = (appId: string, appRole: AppPermission["role"]) => {
    setAppPermissions((prev) =>
      prev.map((p) => (p.appId === appId ? { ...p, role: appRole, features: appRole === "none" ? [] : p.features } : p)),
    );
  };

  const handleFeatureToggle = (appId: string, featureId: string, checked: boolean) => {
    setAppPermissions((prev) =>
      prev.map((p) => {
        if (p.appId === appId) {
          const newFeatures = checked 
            ? [...(p.features || []), featureId]
            : (p.features || []).filter(f => f !== featureId);
          return { ...p, features: newFeatures };
        }
        return p;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      ...(password ? { password } : {}),
      role,
      userType,
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
          autoComplete="new-password"
        />
        <Select
          id="userType"
          label="Tipe Pengguna"
          options={userTypeOptions}
          value={userType}
          onChange={(e) => setUserType(e.target.value as User["userType"])}
        />
        {userType === "internal_admin" && (
          <Select
            id="role"
            label="Role Global"
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Toggle
          checked={status === "active"}
          onChange={(checked) => setStatus(checked ? "active" : "inactive")}
          label="Akun Aktif"
        />
      </div>

      {userType === "internal_admin" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Hak Akses per Aplikasi (RBAC) & Fitur
          </label>
          <div className="space-y-3 rounded-lg border border-slate-200 p-4 max-h-[400px] overflow-y-auto">
            {appPermissions.map((perm) => {
              const currentApp = apps?.find(a => a.id === perm.appId);
              const availableFeatures = currentApp?.availableFeatures || [];
              
              return (
                <div
                  key={perm.appId}
                  className="flex flex-col gap-3 rounded-md bg-slate-50 px-3 py-3 border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
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
                              : "text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {r === "none" ? "Tidak" : r === "viewer" ? "Viewer" : "Operator"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sub-features checkboxes */}
                  {perm.role !== "none" && (
                    <div className="pl-2 border-l-2 border-emerald-200 ml-1 mt-1 grid grid-cols-2 gap-2">
                      {availableFeatures.map(feat => (
                        <div key={feat.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`${perm.appId}-${feat.id}`}
                            checked={Array.isArray(perm.features) ? perm.features.includes(feat.id) : false}
                            onChange={(e) => handleFeatureToggle(perm.appId, feat.id, e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor={`${perm.appId}-${feat.id}`} className="text-xs text-slate-600 cursor-pointer">
                            {feat.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

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
