import { api } from "@/lib/api"

const getAdminDashboardStats = async () => {
    const res = await api.get("/api/admin/dashboard")
    return res?.data || null
}

export { getAdminDashboardStats }