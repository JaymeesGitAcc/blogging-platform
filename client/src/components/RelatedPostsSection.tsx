import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, User, BookOpen } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import type { Post } from "@/types/post.types"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getRelatedPosts } from "@/services/posts.api"

interface RelatedPostsSectionProps {
  post: Post
}

function RelatedPostsSection({ post }: RelatedPostsSectionProps) {

  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])

  const loadRelatedPosts = async (id: string) => {
    try {
      const res = await getRelatedPosts(id)
      const { data } = res
      setRelatedPosts(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(post) loadRelatedPosts(post._id)
  }, [post])

  if(!relatedPosts.length)
    return null

  return (
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Related Posts
          </h3>
          <p className="text-muted-foreground">
            Discover more great content on similar topics...
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts?.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post.slug}`}
                className="group block"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
                  {/* Cover Image */}
                  <div className="relative h-[150px] bg-slate-200 overflow-hidden">
                    {post.coverImage?.url ? (
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                        <svg
                          className="w-16 h-16 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <CardContent className="pt-2 space-y-2">
                    <h3 className="font-bold text-md text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="h-3 w-3" />
                      <span>{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}

export default RelatedPostsSection
