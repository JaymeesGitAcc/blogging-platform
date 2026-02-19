import { sendError, sendSuccess } from "../utils/response.js"
import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Comment from "../models/comment.model.js"
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

const deleteUser = async (req, res) => {
  const { email, password } = req.body
  let deletionStatus = "failure"

  if (!email || !password) return sendError(res, "Required fields missing", 400)

  try {
    const user = await User.findOne({ email })
    
    if (!user) return sendError(res, "User Not found", 404, { deletionStatus })

    const isPasswordCorrect = await user.matchPassword(password)

    if (!isPasswordCorrect)
      return sendError(res, "Incorrect Password", 400, { deletionStatus })

    const deletedUserComments = await Comment.deleteMany({ author: user._id })
    const deletedUserPosts = await Post.deleteMany({ author: user._id })

    console.log("deleted commments", deletedUserComments)
    console.log("deletedPosts", deletedUserPosts)

    await User.findByIdAndDelete(user._id)

    deletionStatus = "success"

    return sendSuccess(res, "Account Deleted Successfully", 200, {
      deletionStatus,
    })
  } catch (error) {
    return sendError(res, "Internal Server Error", 500, { deletionStatus })
  }
}

export { getUserProfile, deleteUser }
