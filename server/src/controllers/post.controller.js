import Post from "../models/post.model.js"
import Comment from "../models/comment.model.js"
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

const getPublishedPosts = async (req, res) => {
  try {
    const { search, tag } = req.query
    const sortBy = req.query.sort || "recent"
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 6
    const skip = (page - 1) * limit

    // 🔀 Sorting Logic
    let sortStage = { createdAt: -1 }

    if (sortBy === "popular") {
      sortStage = { likesCount: -1, createdAt: -1 }
    } else if (sortBy === "oldest") {
      sortStage = { createdAt: 1 }
    } else if (sortBy === "trending") {
      sortStage = { trendingScore: -1 }
    }

    const posts = await Post.aggregate([
      {
        $match: {
          isDeleted: false,
          status: "published",
          ...(search && {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { content: { $regex: search, $options: "i" } },
            ],
          }),
          ...(tag && { tags: tag }),
        },
      },
      // 👤 Join Author
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      // 💬 Join Comments to count them
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments",
        },
      },

      // ❤️ Likes count & 💬 Comments count
      {
        $addFields: {
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" },
        },
      },

      // 🕒 Calculate age in hours
      {
        $addFields: {
          hoursSinceCreated: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },

      // 🔥 Trending score formula
      {
        $addFields: {
          trendingScore: {
            $divide: [
              {
                $add: [
                  { $multiply: ["$likesCount", 3] },
                  { $multiply: ["$commentsCount", 2] },
                  { $multiply: ["$views", 0.5] },
                ],
              },
              { $add: ["$hoursSinceCreated", 2] },
            ],
          },
        },
      },

      // 🧹 Remove heavy comments array
      {
        $project: {
          comments: 0,
        },
      },

      // 🔀 Apply Sorting
      { $sort: sortStage },

      // 📄 Pagination
      { $skip: skip },
      { $limit: limit },
    ])

    const total = await Post.countDocuments()

    return sendSuccess(res, "Posts fetched", 200, posts, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
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

    if (req.user && post.author._id.toString() !== req.user._id.toString()) {
      post.views += 1
      await post.save()
    }

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
      tags = [...new Set(tags.map((tag) => tag.trim().toLowerCase()))]
    }

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

    const { title, content, status } = req.body

    if (title) {
      post.title = title
      post.slug = slugify(title, { lower: true, strict: true })
    }
    if (content) post.content = content

    let tags = []
    if (req.body.tags) {
      tags = JSON.parse(req.body.tags)
    }
    post.tags = [...new Set(tags?.map((tag) => tag.trim().toLowerCase()))]

    if (status) post.status = status

    // Update excerpt if content changed
    if (content) post.excerpt = generateExcerpt(content)

    let coverImageLocalPath
    if (req.files?.coverImage && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
    }

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
    await Comment.deleteMany({ post: post._id })
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

const getRelatedPosts = async (req, res) => {
  try {
    const id = String(req.params.id)
    const currentPost = await Post.findById(id)

    if (!currentPost) return sendError(res, "Post not found", 404)

    const relatedPosts = await Post.find({
      _id: { $ne: currentPost._id },
      tags: { $in: currentPost.tags },
      status: "published",
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title slug coverImage createdAt")
      .populate("author", "name")

    return sendSuccess(res, "Related posts fetched", 200, relatedPosts)
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
  getRelatedPosts,
}
