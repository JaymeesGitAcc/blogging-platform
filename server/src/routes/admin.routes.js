import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import {
  getAdminDashboardStats,
  getAllPostsAdmin,
  getAllUsersAdmin,
  setUserStatus,
} from "../controllers/admin.controller.js"

const router = express.Router()

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboardStats,
)

router.get("/posts", protect, authorizeRoles("admin"), getAllPostsAdmin)

router.get("/users", protect, authorizeRoles("admin"), getAllUsersAdmin)

router.put("/users/status/:id", protect, authorizeRoles("admin"), setUserStatus)

export default router
