import { api } from "@/lib/api"

const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
    })
    return response
  } catch (error: any) {
    console.log("registerUser Error::", error.message)
    return null
  }
}

export { registerUser }
