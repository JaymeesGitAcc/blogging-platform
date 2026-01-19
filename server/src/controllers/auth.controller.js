import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateToken = (id, role) => {
	return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const registerUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "Name, email, and password are required" })
		}

		const userExists = await User.findOne({ email })
		if (userExists)
			return res.status(400).json({ message: "User already exists" })

		// Determine role
		let userRole = "reader" // default
		if (req.user && req.user.role === "admin" && role) {
			// Admin can set a custom role
			userRole = role
		}
        
		const user = await User.create({ name, email, password, role: userRole })
        
		return res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id, user.role),
		})
	} catch (error) {
		return res.status(500).json({ message: `registerUser Error :: ${error}` })
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password)
			return res
				.status(400)
				.json({ message: "Email and Password are required" })

		const user = await User.findOne({ email })

		if (!user) return res.status(400).json({ messsage: "Invalid credentials" })

		const isMatch = await user.matchPassword(password)

		if (!isMatch)
			return res.status(400).json({ message: "Invalid credentials" })

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		)

		return res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token,
		})
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

export { registerUser, login }
