import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import {
  getAdminDashboardStats,
  getAllPostsAdmin,
} from "../controllers/admin.controller.js"

const router = express.Router()

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboardStats,
)

router.get("/posts", protect, authorizeRoles("admin"), getAllPostsAdmin)

export default router
