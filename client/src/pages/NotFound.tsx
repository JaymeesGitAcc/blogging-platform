import BackButton from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { Home, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="mb-6">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-3">404</h1>

        <p className="mb-8">Page not found</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-primary hover:bg-primary-hover text-background flex items-center justify-center gap-2"
            asChild
          >
            <Link to="/">
              <Home size={16} />
              Home
            </Link>
          </Button>
          <BackButton />
        </div>
      </div>
    </div>
  )
}
