"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { User } from "@/types";

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
              <Avatar name={user.name} size="sm" />
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
      ]}
      data={data}
      keyExtractor={(u) => u.id}
      onRowClick={onRowClick}
      loading={loading}
      emptyMessage="Belum ada pengguna"
    />
  );
}
