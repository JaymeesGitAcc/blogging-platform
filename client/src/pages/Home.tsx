import FeaturedPostCard from "@/components/FeaturedPostCard"
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
  PenLine,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadPosts = async () => {
      console.log("Inside Load Post")

      try {
        const response = await getAllPosts()
        console.log("API fetched")

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
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary to-purple-600 rounded-full p-2">
                <PenLine className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                BlogHub
              </span>
            </div>
            <div className="flex items-center gap-4">
              {!user ? (
                <Button variant="ghost" onClick={() =>  navigate("/login")}>Login</Button>
              ) : (
                <Button variant="ghost" onClick={logout}>Logout</Button>
              )}

              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-2 text-sm">
            <Sparkles className="h-3 w-3 mr-2 inline" />
            Your Story, Your Way
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Write. Share. Inspire.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            A beautiful platform to share your thoughts with the world. Create
            stunning blog posts in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 group">
              Start Writing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Explore Blogs
            </Button>
          </div>

          {/* Hero Image/Mockup */}
          {/* <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border p-2">
              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80"
                alt="Blog Preview"
                className="rounded-xl w-full"
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Trending Stories
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover the latest posts from our community of writers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {posts?.map((post) => (
              <FeaturedPostCard
                key={post._id}
                authorName={post?.author?.name}
                title={post?.title}
                excerpt={post?.excerpt}
                likes={post?.likes}
                slug={post?.slug}
                tags={post?.tags}
                views={post?.views}
                imageUrl={post?.coverImage?.url}
              />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" className="group">
              View All Posts
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple to Get Started
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three easy steps to share your story with the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Create Account</h3>
              <p className="text-slate-600">
                Sign up in seconds and start your blogging journey today.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Write Your Story</h3>
              <p className="text-slate-600">
                Use our beautiful editor to craft your perfect blog post.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Share & Grow</h3>
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
          <Card className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of writers who trust BlogHub to share their ideas
                with the world.
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Writing for Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-primary to-purple-600 rounded-full p-1.5">
                  <PenLine className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-white">BlogHub</span>
              </div>
              <p className="text-sm">Share your stories with the world.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 BlogHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
