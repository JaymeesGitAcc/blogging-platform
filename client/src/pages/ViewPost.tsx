import BlogNotFound from "@/components/BlogNotFound"
import CommentsSection from "@/components/CommentsSection"
import DeleteAlert from "@/components/DeleteAlert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getCommentsByPost, updateComment } from "@/services/comments.api"
import {
  deletePost,
  getPostBySlug,
  togglePostLike,
} from "@/services/posts.api.ts"
import type { Comment } from "@/types/comment.types"
import type { Post } from "@/types/post.types.ts"
import { formatContent } from "@/utils/formatContent"
import { formatDate } from "@/utils/formatDate"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { Separator } from "@radix-ui/react-separator"
import {
  Calendar,
  Eye,
  FileEdit,
  Heart,
  Share2,
  Trash2,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

const ViewPost = () => {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState<number>(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalComments, setTotalComments] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [removedComment, setRemovedComment] = useState<Comment | null>(null)
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAuthor = user?._id === post?.author?._id
  const limit = 5

  const handleLike = async () => {
    const response = await togglePostLike(post?._id)

    if (!response) {
      toast.error("Something went wrong")
    }

    if (response?.message == "Post liked") {
      setIsLiked(true)
      setLikesCount((prev) => prev + 1)
      toast.success("Post Liked", { position: "bottom-right" })
    } else {
      setIsLiked(false)
      setLikesCount((prev) => prev - 1)
      toast.success("Post unliked", { position: "bottom-right" })
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const res = await deletePost(post?._id)
      console.log("Blog deletion response", res)
      toast.success("Blog Deleted Successfully", { position: "top-right" })
      setTimeout(() => {
        navigate("/")
      }, 1000)
    } catch (error: any) {
      toast.error(error.message || "Couldn't delete post", {
        position: "bottom-right",
      })
      console.log(error.message)
    }
  }

  const handleAddComment = (comment: Comment) => {
    if (page === 1) {
      if (comments.length === limit) {
        setComments((prev) => [comment, ...prev].slice(0, prev.length))
        setRemovedComment(comments[comments.length - 1])
        setHasMore(true)
      } else {
        setComments((prev) => [comment, ...prev])
      }
    } else {
      setComments((prev) => [comment, ...prev])
    }
    setTotalComments((pre) => pre + 1)
  }

  // console.log(comments);

  const handleRemoveComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId))
    setTotalComments((c) => c - 1)
  }

  const loadCommments = async (pageToLoad = 1) => {
    try {
      const response = await getCommentsByPost(post?._id, pageToLoad, limit)
      if (!response) return
      const { data: newComments, meta } = response

      setTotalPages(meta.totalPages)
      if (meta.totalPages > 1) {
        setHasMore(true)
      }
      setTotalComments(meta.total)
      setHasMore(pageToLoad < meta.totalPages)
      if (!removedComment) {
        setComments((prev) => [...prev, ...newComments])
      } else {
        if (comments.length < limit) {
          setComments((prev) => [
            ...prev,
            { ...removedComment },
            ...newComments,
          ])
        } else {
          setComments((prev) => [
            ...prev,
            { ...removedComment },
            ...newComments.slice(1),
          ])
        }
        setRemovedComment(null)
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleUpdateComment = async (id: string, content: string) => {
    try {
      const response = await updateComment(id, content)
      if (!response)
        toast.error("Something went wrong", { position: "bottom-right" })

      console.log(response.data)

      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, content } : c)),
      )
      toast.success("Comment Updated!", { position: "top-right" })
    } catch (error) {
      toast.error("Something went wrong", { position: "bottom-right" })
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadCommments(nextPage)
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const fetchedPost = await getPostBySlug(slug)
        if (fetchedPost) {
          setPost(fetchedPost)
          setLikesCount(fetchedPost?.likes?.length)
        }
      } catch (error: any) {
        console.log("Post Fetch Error::", error.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [slug])

  useEffect(() => {
    if (user && post) {
      if (post?.likes?.includes(user._id)) {
        setIsLiked(true)
      }
    }
    // load comments on the post
    loadCommments()
  }, [post])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) return <BlogNotFound />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags &&
              post.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-sm px-3 py-1"
                >
                  {tag}
                </Badge>
              ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author and Meta Info */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {post.author.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {post.author.email}
                </p>
              </div>
            </div>

            <Separator
              orientation="vertical"
              className="h-12 hidden sm:block"
            />

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Image */}

      {post?.coverImage?.url ? (
        <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "500px" }}
            />
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <Card className="shadow-xl">
          <CardContent className="pt-12 pb-12 px-8 md:px-12">
            <div
              className="prose prose-lg prose-slate max-w-none"
              style={{
                fontSize: "1.125rem",
                lineHeight: "1.75",
                color: "#334155",
              }}
              dangerouslySetInnerHTML={{
                __html: formatContent(post.content),
              }}
            />
          </CardContent>
          <CardContent>
            <div className="flex justify-end">
              {isAuthor ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-red-700 hover:bg-red-800"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Blog</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/update/${post?.slug}`)}
                  >
                    <FileEdit className="h-4 h-4" />
                    <span className="hidden sm:inline">Update Blog</span>
                  </Button>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Section */}
        <Card className="mt-8 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <p className="text-lg mb-4 text-slate-600">
                Did you find this article helpful?
              </p>
              <div className="flex items-center justify-center gap-4">
                {user ? (
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="lg"
                    onClick={handleLike}
                    className="group"
                  >
                    <Heart
                      className={`mr-2 h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    {isLiked ? "Liked" : "Like this post"}
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")}>
                    <Heart className={`mr-2 h-5 w-5`} />
                    Login to like this post
                  </Button>
                )}
                <Button variant="outline" size="lg" className="group">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Bio Section */}
        <Card className="mt-8 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg flex justify-center items-center">
                <AvatarFallback className="text-primary text-2xl">
                  {post.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">
                    About {post.author.name}
                  </h3>
                  <Badge variant="default" className="text-xs">
                    Author
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  A passionate writer and educator sharing insights on web
                  development and technology. Follow for more articles on React,
                  JavaScript, and modern web development practices.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{post.author.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6">
              <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{post.views}</p>
              <p className="text-sm text-muted-foreground">Views</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6">
              <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{likesCount}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </CardContent>
          </Card>
        </div>

        {isAuthor ? (
          <DeleteAlert
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleConfirmDelete}
          />
        ) : null}

        <div className="my-6">
          {comments && (
            <CommentsSection
              comments={comments}
              postId={post?._id}
              hasMore={hasMore}
              total={totalComments}
              onLoadMore={handleLoadMore}
              onAddComment={handleAddComment}
              onRemoveComment={handleRemoveComment}
              onUpdateComment={handleUpdateComment}
            />
          )}
        </div>

        {/* Related Posts Placeholder */}
        {/* <Card className="mt-12 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Related Posts
            </h3>
            <p className="text-muted-foreground">
              Discover more great content on similar topics...
            </p>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default ViewPost
