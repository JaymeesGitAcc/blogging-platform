import { useEffect, useState } from "react"
import { getPostBySlug } from "@/services/posts.api"
import { useParams } from "react-router-dom"
import type { Post } from "@/types/post.types"
import PostForm from "@/components/PostForm"
import BlogNotFound from "@/components/BlogNotFound"

const UpdatePost = () => {
  const [post, setPost] = useState<Post>()
  const { slug } = useParams()

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await getPostBySlug(slug)
        if (response) {
          setPost(response)
        }
      } catch (error: any) {
        console.log(error)
      }
    }
    loadPost()
  }, [slug])

  if(!post) 
    return <BlogNotFound />

  return <PostForm post={post} />
}

export default UpdatePost
