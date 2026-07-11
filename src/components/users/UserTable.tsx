"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import type { User } from "@/types";
import { Edit, Eye, Trash2 } from "lucide-react";

interface UserTableProps {
  data: User[];
  loading?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  isPegawai?: boolean;
}

export function UserTable({ data, loading, onEdit, onDelete, isPegawai }: UserTableProps) {
  const columns = [
        {
          key: "name",
          header: "Pengguna",
          sortable: true,
          render: (user: User) => (
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
          render: (user: User) => (
            <Badge
              variant={
                user.role === "super_admin"
                  ? "info"
                  : user.role === "sub_admin"
                  ? "secondary"
                  : user.role === "pegawai"
                  ? "warning"
                  : user.role === "user" || user.role === "pemohon"
                  ? "outline"
                  : "default"
              }
            >
              {user.role === "super_admin"
                ? "Super Admin"
                : user.role === "sub_admin"
                ? "Sub Admin"
                : user.role === "admin"
                ? "Admin"
                : user.role === "pegawai"
                ? "Pegawai (PTSP)"
                : user.role === "user" || user.role === "pemohon"
                ? "Masyarakat Umum"
                : user.role}
            </Badge>
          ),
        },

        {
          key: "actions",
          header: "Aksi",
          sortable: false,
          render: (user: User) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(user);
                }}
                className="inline-flex items-center justify-center rounded-lg p-2 bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all hover:bg-emerald-100 hover:text-emerald-700 hover:ring-emerald-200"
                title="Edit Profil"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(user);
                }}
                className="inline-flex items-center justify-center rounded-lg p-2 bg-red-50 text-red-600 ring-1 ring-red-100 transition-all hover:bg-red-100 hover:text-red-700 hover:ring-red-200"
                title="Hapus Profil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ),
        },
      ];

  if (isPegawai) {
    // Insert after "Pengguna"
    columns.splice(
      1,
      0,
      {
        key: "nip",
        header: "NIP",
        sortable: true,
        render: (user: User) => {
          const fallbackNip = user.email.includes("@") ? user.email.split("@")[0] : "-";
          return <span className="text-slate-700">{user.nip || fallbackNip}</span>;
        },
      },
      {
        key: "jabatan",
        header: "Jabatan",
        sortable: true,
        render: (user: User) => <span className="text-slate-700">{user.jabatan || "-"}</span>,
      },
      {
        key: "unitKerja",
        header: "Unit Kerja",
        sortable: true,
        render: (user: User) => <span className="text-slate-700">{user.unitKerja || "-"}</span>,
      },
      {
        key: "noHp",
        header: "No HP",
        sortable: true,
        render: (user: User) => {
          let displayHp = user.noHp;
          if (displayHp && displayHp.startsWith("62")) {
            displayHp = "0" + displayHp.substring(2);
          } else if (displayHp && displayHp.startsWith("+62")) {
            displayHp = "0" + displayHp.substring(3);
          }
          return <span className="text-slate-700">{displayHp || "-"}</span>;
        },
      }
    );
  }

  const isMasyarakat = data.some(u => u.userType === "eksternal_masyarakat");
  if (isMasyarakat) {
    const roleIdx = columns.findIndex(c => c.key === "role");
    if (roleIdx !== -1) {
      columns.splice(
        roleIdx + 1,
        0,
        {
          key: "loginMethod",
          header: "Metode Login & WA",
          sortable: true,
          render: (user: User) => {
            const isWhatsapp = user.email.endsWith("@ptsp.id") || user.email.endsWith("@whatsapp.local") || user.email.startsWith("p08");
            return (
              <div className="flex flex-col items-start gap-1">
                <Badge variant={isWhatsapp ? "success" : "info"} className="text-[10px]">
                  {isWhatsapp ? "WhatsApp (PTSP)" : "Google Akun"}
                </Badge>
                {isWhatsapp && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {user.email.replace("@ptsp.id", "").replace("p", "")}
                  </span>
                )}
              </div>
            );
          },
        }
      );
    }
    
    const actionIdx = columns.findIndex(c => c.key === "actions");
    if (actionIdx !== -1) {
      columns.splice(
        actionIdx,
        0,
        {
          key: "kontak",
          header: "Email / No HP",
          sortable: true,
          render: (user: User) => {
            let displayHp = user.noHp;
            if (displayHp && displayHp.startsWith("62")) {
              displayHp = "0" + displayHp.substring(2);
            } else if (displayHp && displayHp.startsWith("+62")) {
              displayHp = "0" + displayHp.substring(3);
            }
            return (
              <div className="flex flex-col">
                <span className="text-sm text-slate-900 dark:text-slate-100">{user.email.includes("@ptsp.id") ? "-" : user.email}</span>
                {displayHp && <span className="text-xs font-medium text-slate-500">{displayHp}</span>}
              </div>
            );
          },
        },
        {
          key: "alamat",
          header: "Alamat",
          sortable: true,
          render: (user: User) => (
            <span className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-[200px]" title={user.alamat || ""}>
              {user.alamat || "-"}
            </span>
          ),
        }
      );
    }
  }

  return (
    <Table<User>
      columns={columns}
      data={data}
      keyExtractor={(u) => u.id}
      loading={loading}
      emptyMessage="Belum ada pengguna"
    />
  );
}
