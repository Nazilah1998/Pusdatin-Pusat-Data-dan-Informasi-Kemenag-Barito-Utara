"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import type { User } from "@/types";
import { Pencil, Eye } from "lucide-react";

interface UserTableProps {
  data: User[];
  loading?: boolean;
  onRowClick?: (user: User) => void;
}

export function UserTable({ data, loading, onRowClick }: UserTableProps) {
  return (
    <Table<User>
      columns={[
        {
          key: "name",
          header: "Pengguna",
          sortable: true,
          render: (user) => (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <img
                  src="/branding/kemenag.svg"
                  alt="Kemenag"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div>
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: "role",
          header: "Role",
          sortable: true,
          render: (user) => (
            <Badge
              variant={
                user.role === "super_admin"
                  ? "info"
                  : "default"
              }
            >
              {user.role === "super_admin"
                ? "Super Admin"
                : "Admin"}
            </Badge>
          ),
        },
        {
          key: "status",
          header: "Status",
          sortable: true,
          render: (user) => (
            <Badge variant={user.status === "active" ? "success" : "default"}>
              {user.status === "active" ? "Aktif" : "Nonaktif"}
            </Badge>
          ),
        },
        {
          key: "createdAt",
          header: "Bergabung",
          sortable: true,
          render: (user) => (
            <span className="text-slate-500">
              {new Date(user.createdAt).toLocaleDateString("id-ID")}
            </span>
          ),
        },
        {
          key: "actions",
          header: "Aksi",
          sortable: false,
          render: (user) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick?.(user);
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                title="Lihat / Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ),
        },
      ]}
      data={data}
      keyExtractor={(u) => u.id}
      onRowClick={onRowClick}
      loading={loading}
      emptyMessage="Belum ada pengguna"
    />
  );
}
