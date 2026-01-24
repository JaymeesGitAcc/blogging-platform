import { api } from "@/lib/api"

const getAllPosts = async () => {
  try {
    const response = await api.get("/api/posts")
    return response.data
  } catch (error: any) {
    console.error(error.message)
    return { data: [] }
  }
}

const getPostBySlug = async (slug: string | undefined) => {
  try {
    if (!slug) return null
    const response = await api.get(`/api/posts/${slug}`)
    const { data } = response.data
    return data
  } catch (error: any) {
    console.log("getPostBySlug Error ::", error.message)
    return null
  }
}

const togglePostLike = async (postId: string | undefined) => {
  try {
    const response = await api.put(`/api/posts/${postId}/like`)
    // console.log(response);
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

export { getPostBySlug, togglePostLike, getAllPosts, createPost }
