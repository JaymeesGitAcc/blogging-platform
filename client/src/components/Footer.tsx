import {
  Mail,
  Heart,
  Feather,
} from "lucide-react"

function LinkedInIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function TwitterIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function GithubIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-[#1A1F36] rounded-full p-2">
              <Feather className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1A1F36]">
              COLUMN
            </span>
          </div>

          {/* Tagline */}
          <p className="text-slate-600 max-w-md">
            Share your stories with the world
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              {/* <Linkedin className="h-4 w-4" /> */}
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

          {/* Copyright */}
          <p className="text-sm text-slate-600 flex items-center gap-2">
            © {new Date().getFullYear()} BlogHub • Made with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />{" "}
            by Andrew James
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
