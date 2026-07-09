"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDashboardStats, useReportData, useActivityData } from "@/hooks/use-reports";
import { useSystemHealth } from "@/hooks/use-apps";
import { useAuditLogs } from "@/hooks/use-audit";
import { formatRelativeDate } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import {
  Users,
  Monitor,
  Activity,
  FileText,
  Cpu,
  HardDrive,
  Database,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: activity } = useActivityData();
  const { data: reportData } = useReportData();
  const { data: auditData } = useAuditLogs({ limit: 5 });
  const { isDark } = useUIStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview sistem Pusdatin Kemenag Barito Utara
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Pengguna"
          value={stats?.totalUsers}
          loading={statsLoading}
          color="text-blue-600 bg-blue-100"
        />
        <StatCard
          icon={Monitor}
          label="Aplikasi Aktif"
          value={stats?.onlineApps}
          suffix={`/ ${stats?.totalApps || 0}`}
          loading={statsLoading}
          color="text-emerald-600 bg-emerald-100"
        />
        <StatCard
          icon={Activity}
          label="Log Hari Ini"
          value={stats?.todayLogs}
          loading={statsLoading}
          color="text-amber-600 bg-amber-100"
        />
        <StatCard
          icon={FileText}
          label="Total Log"
          value={stats?.totalLogs}
          loading={statsLoading}
          color="text-purple-600 bg-purple-100"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 dark:text-white">Aktivitas</h3>
            </CardHeader>
            <CardBody>
              {activity ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activity}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: isDark ? "#64748b" : "#94a3b8" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: isDark ? "#64748b" : "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          backgroundColor: isDark ? "#0f172a" : "#fff",
                          color: isDark ? "#f8fafc" : "#0f172a",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: "#10b981", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 dark:text-white">Distribusi per Aplikasi</h3>
            </CardHeader>
            <CardBody>
              {reportData ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                      <XAxis
                        dataKey="appName"
                        tick={{ fontSize: 12, fill: isDark ? "#64748b" : "#94a3b8" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: isDark ? "#64748b" : "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
                          backgroundColor: isDark ? "#0f172a" : "#fff",
                          color: isDark ? "#f8fafc" : "#0f172a",
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 dark:text-white">Kesehatan Sistem</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              {healthLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : health ? (
                <>
                  <ProgressBar
                    label="CPU"
                    value={health.cpu}
                    variant={health.cpu > 80 ? "danger" : health.cpu > 60 ? "warning" : "default"}
                  />
                  <ProgressBar
                    label="RAM"
                    value={health.ram}
                    variant={health.ram > 80 ? "danger" : health.ram > 60 ? "warning" : "default"}
                  />
                  <ProgressBar
                    label="Penyimpanan"
                    value={health.storage}
                    variant={health.storage > 80 ? "danger" : health.storage > 60 ? "warning" : "default"}
                  />
                  <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <Database className="h-3 w-3" />
                    Uptime: {health.uptime}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Data tidak tersedia
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900 dark:text-white">Aktivitas Terbaru</h3>
            </CardHeader>
            <CardBody className="p-0">
              {auditData?.data ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditData.data.slice(0, 5).map((log) => (
                    <div key={log.id} className="px-6 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {log.target}
                        </span>
                        <Badge
                          variant={
                            log.action === "INSERT"
                              ? "success"
                              : log.action === "DELETE"
                                ? "danger"
                                : "warning"
                          }
                        >
                          {log.action}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {formatRelativeDate(log.timestamp)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  <Activity className="mx-auto mb-2 h-5 w-5 text-slate-300 dark:text-slate-600" />
                  Belum ada aktivitas
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  loading,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value?: number;
  suffix?: string;
  loading?: boolean;
  color: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-7 w-16" />
            ) : (
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {value ?? "—"}
                {suffix && <span className="ml-1 text-base font-normal text-slate-400 dark:text-slate-500">{suffix}</span>}
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
