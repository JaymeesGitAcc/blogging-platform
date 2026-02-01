import express from "express"
import {
	createPost,
	deletePost,
	getPostBySlug,
	getPublishedPosts,
	getRelatedPosts,
	toggleLikePost,
	updatePost,
} from "../controllers/post.controller.js"
import { optionalAuth, protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import upload from "../middlewares/multer.middleware.js"

const router = express.Router()

router.get("/", getPublishedPosts)
router.get("/:slug",optionalAuth, getPostBySlug)

router.post(
	"/",
	protect,
	authorizeRoles("user", "admin"),
	upload.fields([
		{
			name: "coverImage",
			maxCount: 1,
		},
	]),
	createPost,
)

router.put(
	"/:id",
	protect,
	authorizeRoles("user", "admin"),
	upload.fields([
		{
			name: "coverImage",
			maxCount: 1,
		},
	]),
	updatePost,
)

router.delete("/:id", protect, authorizeRoles("admin", "user"), deletePost)
router.put("/:id/like", protect, toggleLikePost)

router.get("/related/:id", getRelatedPosts)

export default router
