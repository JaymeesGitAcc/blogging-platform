import { sendError, sendSuccess } from "../utils/response.js"
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import mongoose from "mongoose"

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params

    const userObjectId = new mongoose.Types.ObjectId(id)

    // Get user basic info
    const user = await User.findById(id).select("-password")
    if (!user) return sendError(res, "User not found", 404)

    // Count total posts by this author
    const totalPosts = await Post.countDocuments({
      author: userObjectId,
      isDeleted: false,
    })

    // Total likes received across all user's posts
    const likesAgg = await Post.aggregate([
      {
        $match: {
          author: userObjectId,
          isDeleted: false,
        },
      },
      {
        $project: {
          likesCount: { $size: { $ifNull: ["$likes", []] } },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" },
        },
      },
    ])

    const totalLikesReceived = likesAgg[0]?.totalLikes || 0

    return sendSuccess(res, "Profile fetched", 200, {
      user,
      totalPosts,
      totalLikesReceived,
    })
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

export { getUserProfile }
