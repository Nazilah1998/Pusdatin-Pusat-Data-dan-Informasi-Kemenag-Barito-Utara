"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { AuditTable } from "@/components/audit/AuditTable";
import { AuditFilters } from "@/components/audit/AuditFilters";
import { useAuditLogs } from "@/hooks/use-audit";
import { useApps } from "@/hooks/use-apps";
import { formatDate } from "@/lib/utils";
import type { AuditLog } from "@/types";

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [schemaTab, setSchemaTab] = useState("");

  const { data: apps } = useApps();

  const { data, isLoading } = useAuditLogs({
    action: action || undefined,
    search: search || undefined,
    targetSchema: schemaTab || undefined,
    limit: 50,
  });

  const tabs = [
    { id: "", label: "Semua Sistem" },
    { id: "kemenag_pusdatin", label: "Pusdatin (Pusat)" },
    ...(apps || []).map((app: any) => ({
      id: app.schemaName || app.id,
      label: app.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
        <p className="mt-1 text-sm text-slate-500">
          Catatan perubahan data yang dilakukan oleh administrator
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSchemaTab(tab.id)}
            className={`
              inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
              ${
                schemaTab === tab.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-600"
                  : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-sm"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <AuditFilters
            action={action}
            search={search}
            onActionChange={setAction}
            onSearchChange={setSearch}
          />
        </CardHeader>
        <CardBody className="p-0">
          <AuditTable
            data={data?.data || []}
            loading={isLoading}
            onRowClick={(log) => setSelectedLog(log)}
          />
        </CardBody>
      </Card>

      <Dialog
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Detail Audit Log"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Waktu</p>
                <p className="text-sm font-medium text-slate-700">
                  {formatDate(selectedLog.timestamp)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Aksi</p>
                <Badge
                  variant={
                    selectedLog.action === "INSERT"
                      ? "success"
                      : selectedLog.action === "DELETE"
                        ? "danger"
                        : "warning"
                  }
                >
                  {selectedLog.action}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500">Target</p>
                <p className="text-sm font-medium text-slate-700">
                  {selectedLog.target}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Schema</p>
                <p className="text-sm font-medium text-slate-700">
                  {selectedLog.targetSchema}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Oleh</p>
                <p className="text-sm font-medium text-slate-700">
                  {selectedLog.performedBy}
                </p>
              </div>
            </div>

            {selectedLog.beforeState && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Before State</p>
                <pre className="overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600 max-h-40">
                  {JSON.stringify(selectedLog.beforeState, null, 2)}
                </pre>
              </div>
            )}
            {selectedLog.afterState && (
              <div>
                <p className="text-xs text-slate-500 mb-1">After State</p>
                <pre className="overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-600 max-h-40">
                  {JSON.stringify(selectedLog.afterState, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
