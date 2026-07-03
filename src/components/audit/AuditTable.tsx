"use client";

import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeDate } from "@/lib/utils";
import type { AuditLog } from "@/types";

const actionVariant: Record<string, "success" | "danger" | "warning"> = {
  INSERT: "success",
  DELETE: "danger",
  UPDATE: "warning",
};

interface AuditTableProps {
  data: AuditLog[];
  loading?: boolean;
  onRowClick?: (log: AuditLog) => void;
}

export function AuditTable({ data, loading, onRowClick }: AuditTableProps) {
  return (
    <Table<AuditLog>
      columns={[
        {
          key: "timestamp",
          header: "Waktu",
          sortable: true,
          render: (log) => (
            <span className="text-slate-600 text-xs">
              {formatRelativeDate(log.timestamp)}
            </span>
          ),
        },
        {
          key: "action",
          header: "Aksi",
          render: (log) => (
            <Badge variant={actionVariant[log.action]}>{log.action}</Badge>
          ),
        },
        {
          key: "target",
          header: "Target",
          sortable: true,
          render: (log) => (
            <div>
              <p className="font-medium text-slate-700">{log.target}</p>
              <p className="text-xs text-slate-400">{log.targetSchema}</p>
            </div>
          ),
        },
        {
          key: "performedBy",
          header: "Oleh",
          sortable: true,
        },
        {
          key: "id",
          header: "Detail",
          render: () => (
            <span className="text-emerald-600 text-xs font-medium hover:underline cursor-pointer">
              Lihat detail
            </span>
          ),
        },
      ]}
      data={data}
      keyExtractor={(l) => l.id}
      onRowClick={onRowClick}
      loading={loading}
      emptyMessage="Belum ada log audit"
    />
  );
}
