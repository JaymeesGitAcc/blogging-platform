import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Comment from "../models/comment.model.js"
import { sendSuccess, sendError } from "../utils/response.js"

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalPosts = await Post.countDocuments()
    const totalComments = await Comment.countDocuments()

    const likesAgg = await Post.aggregate([
      { $match: { isDeleted: false } },
      { $project: { likesCount: { $size: "$likes" } } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ])
    const totalLikes = likesAgg[0]?.totalLikes || 0

    const mostLikedPostAgg = await Post.aggregate([
      { $match: { isDeleted: false } },
      {
        $addFields: { likesCount: { $size: "$likes" } },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ])

    const mostLikedPost = mostLikedPostAgg[0]
      ? {
          id: mostLikedPostAgg[0]._id,
          title: mostLikedPostAgg[0].title,
          slug: mostLikedPostAgg[0].slug,
          coverImage: mostLikedPostAgg[0].coverImage?.url || null,
          likesCount: mostLikedPostAgg[0].likesCount,
          authorName: mostLikedPostAgg[0].author.name,
        }
      : null

    const mostCommentedAgg = await Comment.aggregate([
      {
        $group: {
          _id: "$post",
          commentsCount: { $sum: 1 },
        },
      },
      { $sort: { commentsCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },
      {
        $lookup: {
          from: "users",
          localField: "post.author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ])

    const mostCommentedPost = mostCommentedAgg[0]
      ? {
          id: mostCommentedAgg[0].post._id,
          title: mostCommentedAgg[0].post.title,
          slug: mostCommentedAgg[0].post.slug,
          commentsCount: mostCommentedAgg[0].commentsCount,
          authorName: mostCommentedAgg[0].author.name
        }
      : null

    const mostViewedDoc = await Post.findOne({ isDeleted: false })
  .sort({ views: -1 })
  .populate("author", "name")
  .select("title slug views coverImage author")

    const mostViewedPost = mostViewedDoc
      ? {
          id: mostViewedDoc._id,
          title: mostViewedDoc.title,
          slug: mostViewedDoc.slug,
          views: mostViewedDoc.views,
          coverImage: mostViewedDoc.coverImage?.url || null,
          authorName: mostViewedDoc.author?.name || "Unknown"
        }
      : null

    const topAuthorAgg = await Post.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$author",
          postCount: { $sum: 1 },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
    ])

    const topAuthor = topAuthorAgg[0]
      ? {
          id: topAuthorAgg[0].author._id,
          name: topAuthorAgg[0].author.name,
          email: topAuthorAgg[0].author.email,
          postCount: topAuthorAgg[0].postCount,
        }
      : null

    const recentUsers = await User.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5)

    return sendSuccess(res, "Dashboard stats fetched", 200, {
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      mostLikedPost,
      mostCommentedPost,
      mostViewedPost,
      topAuthor,
      recentUsers,
    })
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const getAllPostsAdmin = async (req, res) => {
 try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const { status, search } = req.query

    const filter = { isDeleted: false }

    if (status) filter.status = status

    if (search) {
      filter.title = { $regex: search, $options: "i" }
    }

    const posts = await Post.find(filter)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalPosts = await Post.countDocuments(filter)

    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      views: post.views,
      likesCount: post.likes.length,
      createdAt: post.createdAt,
      authorName: post.author?.name || "Unknown",
      authorEmail: post.author?.email || "Unknown"
    }))

    return sendSuccess(res, "Admin posts fetched", 200, formattedPosts, {
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    })
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

export { getAdminDashboardStats, getAllPostsAdmin }
