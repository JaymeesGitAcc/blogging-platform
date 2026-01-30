import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendError, sendSuccess } from "../utils/response.js"

const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const registerUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body
		if (!name || !email || !password) {
			return sendError(res, "Name, email, and password are required")
		}

		const userExists = await User.findOne({ email })
		if (userExists) return sendError(res, "User already exists")

		// Determine role
		let userRole = "reader" // default
		if (req.user && req.user.role === "admin" && role) {
			// Admin can set a custom role
			userRole = role
		}

		const user = await User.create({ name, email, password, role: userRole })

		return sendSuccess(res, "User created Successfully", 201, {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id, user.role),
		})
	} catch (error) {
		return sendError(res, `registerUser Error :: ${error}`)
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password)
			return sendError(res, "Email and Password are required")

		const user = await User.findOne({ email })

		if (!user) return sendError(res, "Invalid credentials")

		const isMatch = await user.matchPassword(password)

		if (!isMatch) return sendError(res, "Invalid credentials")

		if(user.status !== "active") {
			return sendError(res, "Your account is blocked", 403)
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" },
		)

		return sendSuccess(res, "User Logged In successfully", 200, {
			token,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				status: user.status
			},
		})
	} catch (error) {
		return sendError(res, error.message, 500)
	}
}

export { registerUser, login }
