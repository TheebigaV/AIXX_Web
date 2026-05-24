// fe-aixx/src/lib/public/dashboard.ts
import { api } from "./api";

export const fetchDashboardMetrics = () => 
  api.get("/api/admin/dashboard/metrics")