import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {type ReactNode } from "react"

interface Props {
	children: ReactNode
	requiredRole?: "admin" | "user",
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
	const { user } = useAuth()

	if (!user) {
		return <Navigate to="/login" replace />
	}

	if(requiredRole && requiredRole !== user.role) {
		return <Navigate to="/accessdenied" replace />
	}

	return children
}
