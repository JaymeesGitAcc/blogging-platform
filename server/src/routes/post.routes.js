import express from "express"
import {
	createPost,
	deletePost,
	getPostBySlug,
	getPublishedPosts,
	updatePost,
} from "../controllers/post.controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import upload from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/", getPublishedPosts)
router.get("/:slug", getPostBySlug)

router.post(
	"/",
	protect,
	authorizeRoles("author", "admin"),
	upload.fields([
		{
			name: "coverImage",
			maxCount: 1
		}
	]),
	createPost,
)
router.put("/:id", protect, authorizeRoles("author", "admin"), updatePost)
router.delete("/:id", protect, authorizeRoles("admin"), deletePost)

export default router
