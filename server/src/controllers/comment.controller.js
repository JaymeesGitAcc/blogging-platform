import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js"

const addComment = async (req, res) => {
	try {
		const { postId, content } = req.body
		if (!postId || !content) {
			return res.status(400).json({ message: "Post ID and content required" })
		}

		const post = await Post.findById(postId)
		if (!post) return res.status(404).json({ message: "Post not found" })

		const comment = await Comment.create({
			content,
			author: req.user._id,
			post: post._id,
		})

		await comment.populate("author", "name email")

		return res.status(201).json(comment)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const deleteComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.id)
		if (!comment) return res.status(404).json({ message: "Comment not found" })

		if (
			req.user.role !== "admin" &&
			comment.author.toString() !== req.user._id.toString()
		) {
			return res.status(403).json({ message: "Forbidden" })
		}

		await comment.deleteOne()
		return res.status(200).json({ message: "Comment deleted successfully" })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId
    const comments = await Comment.find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 })

    return res.status(200).json(comments)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export { addComment, deleteComment, getCommentsByPost }
