import slugify from "slugify"
import Post from "../models/post.model.js"

export const generateUniqueSlug = async (title, postId = null) => {
  const baseSlug = slugify(title, { lower: true, strict: true })

  const regex = new RegExp(`^${baseSlug}(-\\d+)?$`, "i")

  const existingPosts = await Post.find({ slug: regex }).select("slug _id")

  // Remove current post from conflict list during update
  const filteredSlugs = existingPosts.filter(post =>
    !postId || post._id.toString() !== postId.toString()
  )

  if (filteredSlugs.length === 0) return baseSlug

  const numbers = filteredSlugs.map(post => {
    const match = post.slug.match(/-(\d+)$/)
    return match ? parseInt(match[1]) : 0
  })

  const nextNumber = Math.max(...numbers) + 1
  return `${baseSlug}-${nextNumber}`
}
