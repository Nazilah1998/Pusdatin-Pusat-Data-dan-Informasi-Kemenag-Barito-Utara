"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { UserForm } from "@/components/users/UserForm";
import { useUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users";
import { toast } from "@/components/ui/Toast";
import { ArrowLeft, Trash2, User as UserIcon } from "lucide-react";
import { useState } from "react";
import type { User } from "@/types";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: user, isLoading } = useUser(id);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleUpdate = async (data: Partial<User>) => {
    try {
      await updateUser.mutateAsync({ id, data });
      toast("success", "Pengguna berhasil diperbarui");
      setShowEdit(false);
    } catch {
      toast("error", "Gagal memperbarui pengguna");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(id);
      toast("success", "Pengguna berhasil dihapus");
      router.push("/dashboard/users");
    } catch {
      toast("error", "Gagal menghapus pengguna");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        Pengguna tidak ditemukan
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowEdit(true)}>
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDelete(true)}
            icon={<Trash2 className="h-4 w-4" />}
          >
            Hapus
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-900">Informasi Akun</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Role</p>
              <Badge
                variant={
                  user.role === "super_admin"
                    ? "info"
                    : user.role === "operator"
                      ? "success"
                      : "default"
                }
              >
                {user.role === "super_admin"
                  ? "Super Admin"
                  : user.role === "operator"
                    ? "Operator"
                    : "Viewer"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <Badge variant={user.status === "active" ? "success" : "default"}>
                {user.status === "active" ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500">Bergabung</p>
              <p className="text-sm text-slate-700">
                {new Date(user.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">
                Hak Akses Aplikasi (RBAC)
              </h3>
            </CardHeader>
            <CardBody>
              {user.appPermissions.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <UserIcon className="h-4 w-4" />
                  Belum ada hak akses aplikasi
                </div>
              ) : (
                <div className="space-y-2">
                  {user.appPermissions.map((perm) => (
                    <div
                      key={perm.appId}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {perm.appName}
                      </span>
                      <Badge
                        variant={
                          perm.role === "operator"
                            ? "success"
                            : perm.role === "viewer"
                              ? "info"
                              : "default"
                        }
                      >
                        {perm.role === "operator"
                          ? "Operator"
                          : perm.role === "viewer"
                            ? "Viewer"
                            : "Tidak ada"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Dialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Pengguna"
        size="lg"
      >
        <UserForm
          initialData={user}
          onSubmit={handleUpdate}
          onCancel={() => setShowEdit(false)}
          loading={updateUser.isPending}
        />
      </Dialog>

      <Dialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Hapus Pengguna"
        size="sm"
      >
        <p className="text-sm text-slate-600">
          Apakah Anda yakin ingin menghapus pengguna{" "}
          <span className="font-semibold">{user.name}</span>? Tindakan ini tidak
          dapat dibatalkan.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDelete(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            loading={deleteUser.isPending}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
