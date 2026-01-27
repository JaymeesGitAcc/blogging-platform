import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { addComment, deleteComment, getCommentsByPost } from "../controllers/comment.controller.js"

const router = express.Router()

router.post("/:id", protect, addComment)
router.delete("/:id", protect, deleteComment)
router.get("/:id", getCommentsByPost)

export default router