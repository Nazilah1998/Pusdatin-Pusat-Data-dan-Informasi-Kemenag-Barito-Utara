export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "sub_admin";
  userType: "internal_admin" | "internal_pegawai" | "eksternal_masyarakat";
  status: "active" | "inactive";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  appPermissions: AppPermission[];
}

export interface AppPermission {
  appId: string;
  appName: string;
  role: "operator" | "viewer" | "none";
  features?: string[];
}

export interface SateliteApp {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  url: string | null;
  status: "online" | "maintenance" | "degraded";
  schema: string;
  schemaName: string;
  schemaUrl?: string | null;
  lastHealthCheck: Date | null;
  sortOrder: number;
  availableFeatures?: { id: string, label: string }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  target: string;
  targetSchema: string;
  performedBy: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
}

export interface SystemHealth {
  cpu: number;
  ram: number;
  storage: number;
  uptime: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalApps: number;
  onlineApps: number;
  totalLogs: number;
  todayLogs: number;
}

export interface ReportData {
  appName: string;
  count: number;
  color: string;
}

export interface ActivityData {
  date: string;
  count: number;
}
