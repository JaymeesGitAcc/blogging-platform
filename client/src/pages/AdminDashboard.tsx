import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Home,
  User,
  Pen,
  HomeIcon,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import type { StatsProps } from "@/types/admin.types"
import { toast } from "sonner"
import { getAdminDashboardStats } from "@/services/admin.api"
import { Link, useNavigate } from "react-router-dom"
import ManagePosts from "@/components/admin/ManagePosts"
import ManageUsers from "@/components/admin/ManageUsers"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StatsOverview from "@/components/admin/StatsOverview"

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsProps | null>(null)
  const [currentPage, setCurrentPage] = React.useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  const { user } = useAuth()

  const { logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "posts", label: "Manage Posts", icon: FileText },
    { id: "users", label: "Manage Users", icon: Users },
  ]

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <StatsOverview stats={stats} />
      case "users":
        return <ManageUsers />
      case "posts":
        return <ManagePosts />
      default:
        return <StatsOverview stats={stats} />
    }
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getAdminDashboardStats()
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-[#1A1F36] rounded-lg p-2">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-[#1A1F36] bg-clip-text text-transparent">
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
                    ? "bg-[#1A1F36] text-white"
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
            {sidebarOpen && (
              <span className="font-medium">Go Back to Home</span>
            )}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-[#1A1F36] text-white font-semibold">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={`/profile/${user?._id}`}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/create">
                  <DropdownMenuItem>
                    <Pen className="mr-2 h-4 w-4" />
                    <span>Write blog</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/">
                  <DropdownMenuItem>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>Go back to Home</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">{renderContent()}</main>
      </div>
    </div>
  )
}

export default AdminDashboard
