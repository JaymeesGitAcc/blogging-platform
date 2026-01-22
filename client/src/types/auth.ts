export interface User {
	_id: string
	name: string
	email: string
	role: "reader" | "author" | "admin"
}

export interface AuthResponse {
	message: string
	data: {
		token: string
		user: User
	}
}
