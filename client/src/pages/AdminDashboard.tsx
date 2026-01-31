import React, { useEffect, useState } from "react"
import CountUp from "react-countup"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  MessageSquare,
  Heart,
  Eye,
  Crown,
  UserPlus,
  BarChart3,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import AccessDenied from "./AccessDenied"
import type { StatsProps } from "@/types/admin.types"
import { toast } from "sonner"
import { getAdminDashboardStats } from "@/services/admin.api"
import { formatDate } from "@/utils/formatDate"
import { useNavigate } from "react-router-dom"
import ManagePosts from "@/components/admin/ManagePosts"
import ManageUsers from "@/components/admin/ManageUsers"

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsProps | null>(null)
  const [currentPage, setCurrentPage] = React.useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "posts", label: "Manage Posts", icon: FileText },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // Placeholder components
  const ManageUsersPlaceholder = () => (
    <div className="flex items-center justify-center h-96">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>
            User management interface coming soon
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )

  // const ManagePostsPlaceholder = () => (
  //     <ManagePosts />
  // )

  const SettingsPlaceholder = () => (
    <div className="flex items-center justify-center h-96">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Settings className="h-16 w-16 mx-auto mb-4 text-primary" />
          <CardTitle>Settings</CardTitle>
          <CardDescription>Settings panel coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )

  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          📊 Overview Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <CountUp
                className="text-3xl font-bold text-slate-900"
                end={stats?.totalUsers || 0}
                duration={1}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Posts
              </CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <CountUp
                end={stats?.totalPosts || 0}
                duration={1}
                className="text-3xl font-bold text-slate-900"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Comments
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <CountUp
                end={stats?.totalComments || 0}
                duration={1}
                className="text-3xl font-bold text-slate-900"
              />
              <p className="text-xs text-muted-foreground mt-1">
                User interactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Likes
              </CardTitle>
              <Heart className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <CountUp
                end={stats?.totalLikes || 0}
                duration={1}
                className="text-3xl font-bold text-slate-900"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Post reactions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Insights */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          🟧 Content Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Most Liked Post
                </CardTitle>
                <Badge variant="secondary">
                  <CountUp
                    end={stats?.mostLikedPost?.likesCount || 0}
                    duration={1}
                  />{" "}
                  likes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-slate-900 mb-2">
                {stats?.mostLikedPost?.title}
              </p>
              <p className="text-sm text-muted-foreground">
                by {stats?.mostLikedPost.authorName}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Most Commented Post
                </CardTitle>
                <Badge variant="secondary">
                  <CountUp
                    end={stats?.mostCommentedPost.commentsCount || 0}
                    duration={1}
                  />{" "}
                  comments
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-slate-900 mb-2">
                {stats?.mostCommentedPost.title}
              </p>
              <p className="text-sm text-muted-foreground">
                by {stats?.mostCommentedPost?.authorName}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  Most Viewed Post
                </CardTitle>
                <Badge variant="secondary">
                  <CountUp
                    end={stats?.mostViewedPost?.views || 0}
                    duration={1}
                  />{" "}
                  comments
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-slate-900 mb-2">
                {stats?.mostViewedPost?.title}
              </p>
              <p className="text-sm text-muted-foreground">
                by {stats?.mostLikedPost?.authorName}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Insights */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          🟩 User Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Active Author */}
          <Card className="border-2 border-primary/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Most Active Author
              </CardTitle>
              <CardDescription>Top contributor this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white text-xl font-bold">
                    {stats?.topAuthor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold text-lg text-slate-900">
                    {stats?.topAuthor.name}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{stats?.topAuthor.postCount} posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recently Joined Users */}
          <Card className="border-2 border-green-500/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-500" />
                Recently Joined Users
              </CardTitle>
              <CardDescription>Last 5 new members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentUsers?.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(user.createdAt)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardContent />
      case "users":
        return <ManageUsers />
      case "posts":
        return <ManagePosts />
      case "settings":
        return <SettingsPlaceholder />
      default:
        return <DashboardContent />
    }
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getAdminDashboardStats()
        console.log(res.data)
        setStats(res.data)
      } catch (error) {
        console.log("Unable to load Stats :: Error ::", error)
        toast.error("Something went wrong while loading stats", {
          position: "top-center",
        })
      }
    }

    loadStats()
  }, [])

  if (user?.role !== "admin") return <AccessDenied />

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-lg p-2">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
            onClick={() => {
              logout()
              navigate("/")
            }}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium">Go Back to Home</span>}
        </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {menuItems.find((item) => item.id === currentPage)?.label}
              </h1>
              <p className="text-sm text-slate-600">Welcome back, Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold">
                A
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
      </div>
    </div>
  )
}

export default AdminDashboard
