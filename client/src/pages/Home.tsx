import Footer from "@/components/Footer"
import PostCard from "@/components/PostCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { getAllPosts } from "@/services/posts.api"
import type { Post } from "@/types/post.types"
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await getAllPosts(1, "trending")
        if (!response || !Array.isArray(response.data)) {
          console.warn("Invalid posts response", response)
          return
        }
        setPosts(response.data)
      } catch (error: any) {
        console.error("Failed to load posts", error)
      }
    }

    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-2 text-sm bg-[#1A1F36]">
            <Sparkles className="h-3 w-3 mr-2 inline" />
            Your Story, Your Way
          </Badge>

          <h1 className="text-5xl text-[#1A1F36] md:text-7xl font-bold mb-6 leading-tight">
            Write your Story.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            A clean, straightforward space to write and publish. That's it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 group bg-[#1A1F36] hover:bg-[#252D45]"
              onClick={() => {
                if (user) navigate("/create")
                else navigate("/login")
              }}
            >
              Start Writing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => {
              navigate("/posts")
            }}>
              Explore Blogs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F36] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple, powerful tools to help you focus on what matters most -
              your writing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
                <CardDescription className="text-base">
                  Start writing instantly. No setup, no hassle.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Beautiful Editor</CardTitle>
                <CardDescription className="text-base">
                  Write with a clean, distraction-free interface.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Find Readers</CardTitle>
                <CardDescription className="text-base">
                  Connect with an audience that loves your content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Track Growth</CardTitle>
                <CardDescription className="text-base">
                  See how your stories resonate with readers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F36] mb-4">
              Trending Stories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the latest posts from our community of writers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {posts?.slice(0, 3)?.map((post) => (
              <PostCard
                key={post._id}
                authorName={post?.author?.name}
                title={post?.title}
                excerpt={post?.excerpt}
                likes={post?.likes}
                slug={post?.slug}
                tags={post?.tags}
                views={post?.views}
                imageUrl={post?.coverImage?.url}
                createdAt={post?.createdAt}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/posts">
              <Button size="lg" variant="outline" className="group">
                View All Posts
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F36] mb-4">
              Simple to Get Started
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three easy steps to share your story with the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-[#1A1F36] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1A1F36]">
                Create Account
              </h3>
              <p className="text-slate-600">
                Sign up in seconds and start your blogging journey today.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#1A1F36] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1A1F36]">
                Write Your Story
              </h3>
              <p className="text-slate-600">
                Use our beautiful editor to craft your perfect blog post.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#1A1F36] to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1A1F36]">
                Share & Grow
              </h3>
              <p className="text-slate-600">
                Publish your post and watch your audience grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#1A1F36] shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-6 opacity-80 text-white/90" />
              <h2 className="text-3xl text-white/90 md:text-4xl font-bold mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of writers who trust BlogHub to share their ideas
                with the world.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                onClick={() => {
                  if (user) navigate("/create")
                  else navigate("/login")
                }}
              >
                Start Writing for Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
