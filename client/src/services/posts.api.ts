import { api } from "@/lib/api"

const getAllPosts = async (
  page: number = 1,
  sortBy: string = "recent",
  limit = 6,
  search="",
  tag="",
) => {
  const response = await api.get(
    `/api/posts?search=${search}&tag=${tag}&page=${page}&sort=${sortBy}&limit=${limit}`,
  )
  return response.data
}

const getPostBySlug = async (slug: string | undefined) => {
  if (!slug) return null
  const response = await api.get(`/api/posts/${slug}`)
  const { data } = response.data
  return data
}

const togglePostLike = async (postId: string | undefined) => {
  try {
    const response = await api.put(`/api/posts/${postId}/like`)
    return response.data
  } catch (error: any) {
    console.log("togglePostLike Error::", error.message)
    return null
  }
}

const createPost = async (payload: FormData) => {
  const res = await api.post("/api/posts", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

const updatePost = async (id: string | undefined, payload: FormData) => {
  const res = await api.put(`/api/posts/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

const deletePost = async (postId: string | undefined) => {
  return await api.delete(`/api/posts/${postId}`)
}

const getRelatedPosts = async (postId: string) => {
  if(!postId) return null
  const res = await api.get(`/api/posts/related/${postId}`)
  return res.data
}

export {
  getPostBySlug,
  togglePostLike,
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getRelatedPosts
}
