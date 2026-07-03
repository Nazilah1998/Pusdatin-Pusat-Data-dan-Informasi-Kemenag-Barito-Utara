"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { useUsers, useCreateUser } from "@/hooks/use-users";
import { toast } from "@/components/ui/Toast";
import type { User } from "@/types";
import { Plus, Search } from "lucide-react";

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data pengguna dan hak akses aplikasi
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
          Tambah Pengguna
        </Button>
      </div>

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

      <Dialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Tambah Pengguna Baru"
        size="lg"
      >
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createUser.isPending}
        />
      </Dialog>
    </div>
  );
}
