import { api } from "@/lib/api"

const addComment = async (id: string | undefined, content = "string") => {
  if (!id) return null
  const response = await api.post(`/api/comments/${id}`, { content })
  return response.data
}

const getCommentsByPost = async (
  id: string | undefined,
  skip = 0,
  limit = 5,
) => {
  if (!id) return null
  const res = await api.get(`/api/comments/${id}?skip=${skip}&limit=${limit}`)
  return res.data
}

const deleteComment = async (id: string | undefined) => {
  if (!id) return null
  const res = await api.delete(`/api/comments/${id}`)
  return res.data
}

const updateComment = async (id: string | undefined, content: string) => {
  if(!id) return null
  const res = await api.put(`/api/comments/${id}`, {content})
  return res.data
}

export { getCommentsByPost, addComment, deleteComment, updateComment }
