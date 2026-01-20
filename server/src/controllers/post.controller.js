import Post from "../models/post.model.js"
import slugify from "slugify"
import { deleteFromCloudinary, uploadOnCloudinary } from "../config/cloudinary.js"

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
		return res.json(posts)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getPostBySlug = async (req, res) => {
	try {
		const post = await Post.findOne({
			slug: req.params.slug,
			isDeleted: false,
		}).populate("author", "name email")

		if (!post) return res.status(404).json({ message: "Post not found" })

		post.views += 1
		await post.save()

		return res.json(post)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const createPost = async (req, res) => {
	try {
		const { title, content, tags, status } = req.body
		let coverImage = null

		if (!title || !content) {
			return res.status(400).json({ message: "Title and content are required" })
		}

		const slug = slugify(title, { lower: true, strict: true })
		const excerpt = generateExcerpt(content)

		const coverImageLocalPath = req.files?.coverImage[0]?.path

		if (coverImageLocalPath) {
			try {
				const result = await uploadOnCloudinary(coverImageLocalPath)
				coverImage = { url: result.secure_url, publicId: result.public_id }
			} catch (error) {
				return res
					.status(500)
					.json({ message: "Image upload failed", error: error.message })
			}
		}

		const post = await Post.create({
			title,
			slug,
			content,
			excerpt,
			coverImage,
			author: req.user._id,
			tags: [...new Set(tags?.map((tag) => tag.trim().toLowerCase()))] || [],
			status: status || "draft",
		})

		return res.status(201).json(post)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const updatePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) return res.status(404).json({ message: "Post not found" })

		// Only author or admin can edit
		if (
			post.author.toString() !== req.user._id.toString() &&
			req.user.role !== "admin"
		) {
			return res.status(403).json({ message: "Forbidden" })
		}

		const { title, content, tags, status, coverImage } = req.body

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

		if(coverImageLocalPath) {
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
		return res.status(200).json({message: "Post updated successfully", updatedPost})
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post) {
			return res.status(404).json({ message: "Post not found" })
		}

		const isAdmin = req.user.role === "admin"
		const isOwner =
			post.author.toString() === req.user._id.toString()

		if (!isAdmin && !isOwner) {
			return res.status(403).json({ message: "Forbidden" })
		}

		if (post.coverImage?.publicId) {
			await deleteFromCloudinary(post.coverImage.publicId)
		}

		await post.deleteOne()

		return res.status(200).json({
			message: "Post deleted successfully",
		})
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}


export { createPost, updatePost, deletePost, getPublishedPosts, getPostBySlug }
