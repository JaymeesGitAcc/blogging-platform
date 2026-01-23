import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getPostBySlug, togglePostLike } from "@/services/posts.api.ts"
import type { Post } from "@/types/post.types.ts"
import { formatContent } from "@/utils/formatContent"
import { formatDate } from "@/utils/formatDate"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { Separator } from "@radix-ui/react-separator"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Eye,
  Heart,
  Share2,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

const ViewPost = () => {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState<number>(0)
  const { slug } = useParams()
  const { user } = useAuth()

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

  if (!post)
    return (
      <div>
        <h1>Post Not found</h1>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="group"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="ml-2 hidden sm:inline">
                {isLiked ? "Unlike" : "Like"}
              </span>
            </Button>
          </div>
        </div>
      </div>

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

      <div className="max-w-5xl mx-auto px-6 -mt-8 mb-12">
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          {post?.coverImage?.url && (
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: "500px" }}
            />
          )}
        </div>
      </div>

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
        </Card>

        {/* Engagement Section */}
        <Card className="mt-8 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <p className="text-lg mb-4 text-slate-600">
                Did you find this article helpful?
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="lg"
                  onClick={handleLike}
                  className="group"
                >
                  <Heart
                    className={`mr-2 h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Liked" : "Like this post"}({likesCount})
                </Button>
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

        {/* Related Posts Placeholder */}
        <Card className="mt-12 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Related Posts
            </h3>
            <p className="text-muted-foreground">
              Discover more great content on similar topics...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ViewPost
