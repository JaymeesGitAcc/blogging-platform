import React, { createContext, useContext, useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { AuthResponse, User } from "@/types/auth"

interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => void
	hasRole: (role: "admin" | "user" | "reader") => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null)

	// Load user from localStorage on mount
	useEffect(() => {
		const storedUser = localStorage.getItem("user")
		if (storedUser) {
			setUser(JSON.parse(storedUser))
		}
	}, [])

	// Login function
	const login = async (email: string, password: string) => {
		const res = await api.post<AuthResponse>("/api/auth/login", { email, password })
		const { token, user } = res.data.data

		localStorage.setItem("token", token)
		localStorage.setItem("user", JSON.stringify(user))
		setUser(user)
	}

	// Logout function
	const logout = () => {
		localStorage.removeItem("token")
		localStorage.removeItem("user")
		setUser(null)
	}

	// Role check
	const hasRole = (role: "admin" | "user" | "reader") => {
		return user?.role === role
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				login,
				logout,
				hasRole,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

// Custom hook to use AuthContext
export const useAuth = () => {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuth must be used within AuthProvider")
	return ctx
}

export default AuthProvider
