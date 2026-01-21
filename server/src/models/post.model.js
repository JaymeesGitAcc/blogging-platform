import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},

		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			index: true,
		},

		content: {
			type: String,
			required: true,
		},

		excerpt: {
			type: String,
		},

		coverImage: {
			url: {
				type: String,
			},
			publicId: {
				type: String,
			},
		},

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		status: {
			type: String,
			enum: ["draft", "published"],
			default: "draft",
		},

		tags: {
			type: [String],
			default: [],
		},

		views: {
			type: Number,
			default: 0,
		},

		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		],

		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
)

const Post = mongoose.model("Post", postSchema)

export default Post
