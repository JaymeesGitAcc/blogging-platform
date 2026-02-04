import { useEffect, useState } from "react"
import {
  BookOpen,
  Feather,
  Home,
  LogIn,
  LogOut,
  Menu,
  Pen,
  Shield,
  User,
  UserPlus,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth } from "@/contexts/AuthContext"

interface NavLink {
  title: string
  href: string
  icon?: any
}

export default function SmallScreenNav() {
  const [links, setLinks] = useState<NavLink[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    let navLinks: NavLink[] = [
      {
        title: "Home",
        href: "/",
        icon: <Home size={18} />,
      },
      {
        title: "All Blogs",
        href: "/posts",
        icon: <BookOpen size={18} />,
      },
    ]

    if(user) {
      navLinks = [...navLinks, {
        title: "Create Blog",
        href: "/create",
        icon: <Pen size={18} />
      },
    {
      title: "Profile",
      href: `/profile/${user?._id}`,
      icon: <User />
    }]
    } else {
      navLinks = [...navLinks, {
        title: "Login",
        href: "/login",
        icon: <LogIn size={18}/>
      },
      {
        title: "Sign Up",
        href: "/register",
        icon: <UserPlus size={18} />
      }
    ]
    }

    if(user?.role === "admin") {
      navLinks = [
        ...navLinks,
        {
          title: "Admin Dashboard",
          href: "/admin",
          icon: <Shield size={18} />
        }
      ]
    }

    setLinks(navLinks)
  }, [user])

  return (
    <nav className="md:hidden sticky top-0 z-60 bg-background border-b border-border">
      <div className="px-4 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-2">
              <div className="bg-[#1A1F36] rounded-full p-2 transition-transform group-hover:scale-110">
                <Feather className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1A1F36]">COLUMN</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-background-light"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 left-0 right-0 bg-background border-b border-border z-50 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 sm:px-8 py-4 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-primary px-3 py-3 rounded text-sm font-medium transition-all duration-200 flex items-center gap-3"
              onClick={closeMenu}
            >
              <span className="text-primary">{link.icon}</span>
              {link.title}
            </Link>
          ))}
          {user ? (
            <Button
              className="bg-[#1A1F36] hover:bg-[#1A1F36]"
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
            >
              <LogOut size={18} /> Logout
            </Button>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
