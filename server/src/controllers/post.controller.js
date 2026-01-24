import Post from "../models/post.model.js"
import slugify from "slugify"
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../config/cloudinary.js"
import { sendError, sendSuccess } from "../utils/response.js"

const generateExcerpt = (content, length = 150) => {
  return content.length > length
    ? content.substring(0, length) + "..."
    : content
}

const getPublishedPosts = async (_, res) => {
  try {
    const posts = await Post.find({ status: "published", isDeleted: false })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
    return sendSuccess(res, "Posts Fetched Successfully", 200, posts)
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate("author", "name email")

    if (!post) return sendError(res, "Post not found", 404)

    post.views += 1
    await post.save()

    return sendSuccess(res, "Post fetched successfully", 200, post)
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const createPost = async (req, res) => {
  try {
    const { title, content, status } = req.body
    let coverImage = null

    if (!title || !content)
      return sendError(res, "Title and content are required", 400)

    const slug = slugify(title, { lower: true, strict: true })
    const excerpt = generateExcerpt(content)

    let coverImageLocalPath
    if (req.files?.coverImage && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
    }

    if (coverImageLocalPath) {
      try {
        const result = await uploadOnCloudinary(coverImageLocalPath)
        coverImage = { url: result.secure_url, publicId: result.public_id }
      } catch (error) {
        return sendError(res, error.message, 500)
      }
    }

    let tags = []

    if (req.body.tags) {
      tags = JSON.parse(req.body.tags)
    }

    tags = tags.map((tag) => tag.toLowerCase())

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author: req.user._id,
      tags,
      status: status || "draft",
    })

    return sendSuccess(res, "Post created successfully", 201, post)
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return sendError(res, "Post not found", 404)

    // Only author or admin can edit
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendError(res, "Forbidden", 403)
    }

    const { title, content, tags, status } = req.body

    if (title) {
      post.title = title
      post.slug = slugify(title, { lower: true, strict: true })
    }
    if (content) post.content = content
    if (tags)
      post.tags = [...new Set(tags.map((tag) => tag.trim().toLowerCase()))]
    if (status) post.status = status

    // Update excerpt if content changed
    if (content) post.excerpt = generateExcerpt(content)

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (coverImageLocalPath) {
      if (post.coverImage?.publicId) {
        await deleteFromCloudinary(post.coverImage.publicId)
      }
      const uploadedImage = await uploadOnCloudinary(coverImageLocalPath)
      post.coverImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      }
    }

    const updatedPost = await post.save()
    sendSuccess(res, "Post updated successfully", 200, updatedPost)
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return sendError(res, "Post not found", 404)

    const isAdmin = req.user.role === "admin"
    const isOwner = post.author.toString() === req.user._id.toString()

    if (!isAdmin && !isOwner) {
      return sendError(res, "Forbidden", 403)
    }

    if (post.coverImage?.publicId) {
      await deleteFromCloudinary(post.coverImage.publicId)
    }

    await post.deleteOne()

    return sendSuccess(res, "Post deleted sucessfully")
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return sendError(res, "Post not found", 404)

    const userId = req.user._id

    const alreadyLiked = post.likes.includes(userId)

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      )
    } else {
      // Like
      post.likes.push(userId)
    }

    await post.save()

    return sendSuccess(res, alreadyLiked ? "Post unliked" : "Post liked", 200)
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

export {
  createPost,
  updatePost,
  deletePost,
  getPublishedPosts,
  getPostBySlug,
  toggleLikePost,
}
