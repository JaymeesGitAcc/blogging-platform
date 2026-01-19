import express from "express"
import { login, registerUser } from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/admin/register", protect, authorizeRoles("admin"), registerUser)
router.post("/login", login)

export default router
