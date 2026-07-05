"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { useUsers, useCreateUser } from "@/hooks/use-users";
import { useApps } from "@/hooks/use-apps";
import { toast } from "@/components/ui/Toast";
import type { User } from "@/types";
import { Plus, Search } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId") || undefined;
  const userType = searchParams.get("type") || "internal_admin";
  const { data: users, isLoading } = useUsers({ appId, userType });
  const { data: apps } = useApps();
  const createUser = useCreateUser();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"super_admin" | "admin" | "sub_admin">("super_admin");

  const filtered = users?.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (data: Partial<User>) => {
    try {
      await createUser.mutateAsync(data);
      toast("success", "Pengguna berhasil ditambahkan");
      setShowCreate(false);
    } catch {
      toast("error", "Gagal menambahkan pengguna");
    }
  };

    const currentApp = apps?.find((a) => a.id === appId);
    let title = "Manajemen Pengguna";
    if (currentApp) {
      title = `Pengguna - ${currentApp.name}`;
    } else if (userType === "internal_admin") {
      title = "Admin Internal";
    } else if (userType === "internal_pegawai") {
      title = "Pegawai (PTSP)";
    } else if (userType === "eksternal_masyarakat") {
      title = "Masyarakat Umum";
    }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {currentApp ? `Kelola hak akses khusus untuk ${currentApp.name}` : `Kelola data ${title}`}
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Tambah Pengguna
        </Button>
      </div>

      {userType === "internal_admin" ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex space-x-1 rounded-lg bg-slate-100 p-1">
              {(["super_admin", "admin", "sub_admin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {tab === "super_admin"
                    ? "Super Admin"
                    : tab === "admin"
                    ? "Admin"
                    : "Sub Admin"}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Cari pengguna..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              />
            </div>
          </div>

          <Card>
            <CardBody className="p-0">
              <UserTable
                data={filtered?.filter((u) => u.role === activeTab) || []}
                loading={isLoading}
                onRowClick={(user) => router.push(`/dashboard/users/${user.id}`)}
              />
            </CardBody>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Cari pengguna..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              />
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <UserTable
              data={filtered || []}
              loading={isLoading}
              onRowClick={(user) => router.push(`/dashboard/users/${user.id}`)}
            />
          </CardBody>
        </Card>
      )}

      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Tambah Pengguna Baru"
        size="xl"
      >
        <UserForm
          defaultUserType={userType}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createUser.isPending}
        />
      </Dialog>
    </div>
  );
}
