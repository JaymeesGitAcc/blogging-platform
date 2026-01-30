import BackButton from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShieldAlert, Home, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"

const AccessDenied = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full text-center shadow-2xl border-2">
        <CardHeader className="pt-12 pb-6">
          {/* Icon */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <ShieldAlert className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <CardTitle className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Access Denied
          </CardTitle>

          {/* Description */}
          <CardDescription className="text-lg text-slate-600 max-w-md mx-auto">
            You don't have permission to access this page. This area is
            restricted to authorized users only.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-12">
          {/* Error Code */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
              <Lock className="h-4 w-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600">
                Error 403 - Forbidden
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="group" onClick={() => navigate("/")}>
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
            <BackButton variant="outline">Go Back</BackButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AccessDenied
