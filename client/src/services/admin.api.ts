import { api } from "@/lib/api"

const getAdminDashboardStats = async () => {
  const res = await api.get("/api/admin/dashboard")
  return res?.data || null
}

const getAllUsersAdmin = async (
  page = 1,
  limit = 5,
) => {
  const res = await api.get(
    `/api/admin/users?page=${page}&limit=${limit}`,
  )
  return res.data
}

const toggleUserStatus = async (id:string) => {
    if(!id) return null
    const res = await api.put(`/api/admin/users/status/${id}`)
    return res.data
}  

export { getAdminDashboardStats, getAllUsersAdmin, toggleUserStatus }
