import { api } from "@/lib/api"

const deleteAccount = async (email: string, password: string) => {
  const res = await api.post("/api/users/delete", { email, password })
  return res.data
}

export { deleteAccount }
