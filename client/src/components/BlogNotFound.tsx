import { Button } from "@/components/ui/button"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BlogNotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <FileQuestion className="h-20 w-20 text-slate-400" />
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Blog Not Found
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Sorry, the blog article you're looking for doesn't exist or has been removed.
        </p>

        <Button
          onClick={() => navigate("/")}
          className="flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
