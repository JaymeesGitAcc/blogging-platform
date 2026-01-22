import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { ReactNode } from "react"

interface Props {
	children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
	
	const isAuthenticated = localStorage.getItem("user") || null
	// const {isAuthenticated}= useAuth()

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />
	}

	return children
}
