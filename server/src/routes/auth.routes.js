import express from "express"
import { forgotPassword, login, registerUser, resendVerificationEmail, resetPassword, verifyEmail } from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/admin/register", protect, authorizeRoles("admin"), registerUser)
router.post("/login", login)
router.post("/verify-email", verifyEmail)
router.post("/resend-verification", resendVerificationEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)

export default router
