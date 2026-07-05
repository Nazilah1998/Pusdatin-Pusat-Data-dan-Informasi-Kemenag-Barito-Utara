"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { AuditTable } from "@/components/audit/AuditTable";
import { AuditFilters } from "@/components/audit/AuditFilters";
import { useAuditLogs } from "@/hooks/use-audit";
import { formatDate } from "@/lib/utils";
import type { AuditLog } from "@/types";

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [schemaTab, setSchemaTab] = useState("");

  const { data, isLoading } = useAuditLogs({
    action: action || undefined,
    search: search || undefined,
    targetSchema: schemaTab || undefined,
    limit: 50,
  });

  const tabs = [
    { id: "", label: "Semua Sistem" },
    { id: "kemenag_pusdatin", label: "Pusdatin (Pusat)" },
    { id: "e-surat-kemenag", label: "Si MANDAU" },
    { id: "arsip_kemenag", label: "Si BETANG" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Log</h1>
        <p className="mt-1 text-sm text-slate-500">
          Catatan perubahan data yang dilakukan oleh administrator
        </p>
      </div>

      <div className="flex space-x-1 rounded-xl bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSchemaTab(tab.id)}
            className={`
              w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ring-white ring-opacity-60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2
              ${
                schemaTab === tab.id
                  ? "bg-white text-emerald-700 shadow"
                  : "text-slate-600 hover:bg-white/[0.12] hover:text-slate-800"
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
