import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

const addComment = async (req, res) => {
	try {
		const { postId, content } = req.body

		if (!postId || !content) {
			return sendError(res, "Post ID and content required", 400)
		}

		const post = await Post.findById(postId)

		if (!post) return sendError(res, "Post not found", 404)

		const comment = await Comment.create({
			content,
			author: req.user._id,
			post: post._id,
		})

		await comment.populate("author", "name email")

		return sendSuccess(res)
	} catch (error) {
		return sendError(res, error.message, 500)
	}
}

const deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id)

		if (!comment) return sendError(res, "Comment not found", 404)

		if (
			req.user.role !== "admin" &&
			comment.author.toString() !== req.user._id.toString()
		) {
			return sendError(res, "Forbidden", 403)
		}

		await comment.deleteOne()
		return sendSuccess(res, "Comment deleted successfully", 200)
	} catch (error) {
		return sendError(res, error.message, 500)
	}
}

const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId
    const comments = await Comment.find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 })

    return sendSuccess(res, "comments fetched", 200, comments)
  } catch (error) {
	return sendError(res, error.message, 500)
  }
}

export { addComment, deleteComment, getCommentsByPost }
