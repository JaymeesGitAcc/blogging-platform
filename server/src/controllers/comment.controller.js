import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js"
import { sendError, sendSuccess } from "../utils/response.js"

const addComment = async (req, res) => {
  try {
    const { content } = req.body
    const postId = req.params.id

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

    return sendSuccess(res, "Comment added Successfully", 201, comment)
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
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) return sendError(res, "Post not found", 404)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      Comment.find({ post: postId })
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Comment.countDocuments({ post: postId }),
    ])

    return sendSuccess(res, "comments fetched", 200, comments, {
      page,
      total,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const updateComment = async (req, res) => {
  const { content } = req.body
  const commentId = req.params.id

  try {
    const comment = await Comment.findById(commentId)
    if (!comment) sendError(res, "Comment not found", 404)
    
     if (
      req?.user?.role !== "admin" &&
      comment?.author?.toString() !== req?.user?._id.toString()
    ) {
      return sendError(res, "Forbidden", 403)
    }

    comment.content = content
    const updatedComment = await comment.save()

    return sendSuccess(res, "Comment updated", 201, updatedComment)

  } catch (error) {
    sendError(res, "Something went wrong", 500)
  }
}

export { addComment, deleteComment, getCommentsByPost, updateComment }
