import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  ArrowRight,
  PenLine,
  SlidersHorizontal,
  Loader2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { Post } from "@/types/post.types"
import { getAllPosts } from "@/services/posts.api"
import { Input } from "@/components/ui/input"
import PostCard from "@/components/PostCard"
import NoDataPlaceholder from "@/components/NoDataPlaceholder"
import AllPostsPageSkeleton from "@/components/loaders/AllPostsPageSkeleton"

const AllPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  const navigate = useNavigate()
  const { user } = useAuth()
  const limit = 6

  const loadPosts = async (pageToLoad = 1, reset = false) => {
    try {
      const res = await getAllPosts(pageToLoad, sortBy, limit, searchQuery)

      if (reset) {
        setPosts(res.data)
      } else {
        setPosts((prev) => [...prev, ...res.data])
      }

      setTotalPages(res.meta.totalPages)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  const handleLoadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    await loadPosts(nextPage)
    setLoadingMore(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      setPage(1)
      await loadPosts(1, true)
      setIsLoading(false)
    })()
  }, [debouncedSearch, sortBy])

  if (isLoading) return <AllPostsPageSkeleton />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="md:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-[#1A1F36] text-4xl font-bold text-slate-900 mb-2">
                All Blog Posts
              </h1>
              <p className="text-slate-600">
                Discover stories, thinking, and expertise from writers
              </p>
            </div>
            <Button
              size="lg"
              className="group bg-[#1A1F36] hover:bg-[#252D45] mt-4 md:mt-0"
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
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {posts?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : (
          <NoDataPlaceholder />
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          {page < totalPages && (
            <Button
              size="lg"
              variant="outline"
              className="group"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Posts
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllPosts
