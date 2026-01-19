import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.get("/me", protect, (req, res) => {
	res.json({
		message: "User authenticated",
		user: req.user,
	})
})

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
    res.json({
        message: "Welcome Admin",
        admin: req.user
    })
})

export default router
