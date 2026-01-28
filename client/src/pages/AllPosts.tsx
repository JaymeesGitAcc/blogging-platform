import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ArrowRight, PenLine, SlidersHorizontal } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { Post } from "@/types/post.types"
import { getAllPosts } from "@/services/posts.api"
import PostCardSkeleton from "@/components/PostCardSkeleton"
import { Input } from "@/components/ui/input"
import PostCard from "@/components/PostCard"

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()
  const { user } = useAuth()
  const limit = 6

  const loadPosts = async (pageToLoad = 1, reset = false) => {
    setIsLoading(true)
    try {
      const res = await getAllPosts(pageToLoad, sortBy, limit)

      if (reset) {
        setPosts(res.data) 
      } else {
        setPosts((prev) => [...prev, ...res.data])
      }

      setTotalPages(res.meta.totalPages)
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPosts(nextPage)
  }

  useEffect(() => {
    setPage(1)
    loadPosts(1, true)
  }, [sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}

      {!isLoading ? (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="md:flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  All Blog Posts
                </h1>
                <p className="text-slate-600">
                  Discover stories, thinking, and expertise from writers
                </p>
              </div>
              <Button
                size="lg"
                className="group mt-4 md:mt-0"
                onClick={() => {
                  if (user) {
                    navigate("/create")
                  } else {
                    navigate("/login")
                  }
                }}
              >
                <PenLine className="mr-2 h-4 w-4" />
                Write Post
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-[1000px]">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search posts..." className="pl-10" />
              </div>
              <Select
                defaultValue={sortBy}
                onValueChange={(value) => {
                  setPosts([])
                  setSortBy(value)
                }}
              >
                <SelectTrigger className="w-full sm:w-48 h-12">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  {/* <SelectItem value="trending">Trending</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="mb-8 space-y-3">
            <div className="h-10 bg-slate-200 rounded animate-pulse w-64"></div>
            <div className="h-5 bg-slate-200 rounded animate-pulse w-96"></div>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading &&
            [...Array(6)].map((_, index) => <PostCardSkeleton key={index} />)}
          {posts?.map((post) => (
            <PostCard
              key={post._id}
              authorName={post.author.name}
              excerpt={post.excerpt}
              title={post.title}
              imageUrl={post?.coverImage?.url}
              slug={post.slug}
              likes={post.likes}
              tags={post.tags}
              views={post.views}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          {page < totalPages && (
            <Button
              size="lg"
              variant="outline"
              className="group"
              onClick={handleLoadMore}
            >
              Load More Posts
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllPosts
