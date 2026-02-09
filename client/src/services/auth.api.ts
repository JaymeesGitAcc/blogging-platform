import { api } from "@/lib/api"

const registerUser = async (name: string, email: string, password: string) => {
  return await api.post("/api/auth/register", {
    name,
    email,
    password,
  })
}

const loginUser = async (email: string, password: string) => {
  return await api.post("/api/auth/login", { email, password })
}

const verifyEmail = async (token: string) => {
  return await api.post("/api/auth/verify-email", { token })
}

const requestVerificationLink = async (email: string) => {
  return await api.post("/api/auth/resend-verification", { email })
}

const forgotPasswordLink = async (email: string) => {
  return await api.post("/api/auth/forgot-password", { email })
}

const resetPassword = async (token:string, password: string) => {
  return await api.post(`/api/auth/reset-password/${token}`,{password})
}

export {
  registerUser,
  verifyEmail,
  loginUser,
  requestVerificationLink,
  forgotPasswordLink,
  resetPassword
}
