import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import {
  PenLine,
  BookOpen,
  LogIn,
  LogOut,
  Home,
  User,
  Pen,
  BarChart2,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const Navbar = () => {
  //   const isAuthenticated = false // Replace with actual auth state

  const { user, logout } = useAuth()

  //   const currentPath = window.location.pathname

  //   console.log("Current path", currentPath);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-full p-2 group-hover:scale-110 transition-transform">
              <PenLine className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BlogHub
            </span>
          </a>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" className="group">
                <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Home
              </Button>
            </Link>

            <Link to="/posts">
              <Button variant="ghost" className="group">
                <BookOpen className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                All Blogs
              </Button>
            </Link>

            {user && (
              <Link to="/create">
                <Button variant="ghost" className="group">
                  <PenLine className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Create Blog
                </Button>
              </Link>
            )}

            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold">
                        {user.name
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
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <Link to="/create">
                    <DropdownMenuItem>
                      <Pen className="mr-2 h-4 w-4" />
                      <span>Write blog</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                   {user?.role == "admin" && (
                    <Link to="/admin">
                      <DropdownMenuItem>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="group">
                  <LogIn className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
