import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Feather } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { forgotPasswordLink, requestVerificationLink } from "@/services/auth.api"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState("")
  const [showResend, setShowResend] = useState(false)
  const [isSendingLink, setIsSendingLink] = useState(false)

  const { login, user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setShowResend(false)
    setLoading(true)
    setAlert("")

    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }
    try {
      await login(email, password)
      toast.success("You are logged in Successfully")
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      const { data } = err.response.data
      if (data?.verificationMessage) {
        setShowResend(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerificationEmail = async () => {
    setError("")
    setIsSendingLink(true)
    try {
      await requestVerificationLink(email)
      setAlert(
        "Verification email sent again. Check your inbox or check your spam folder",
      )
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setIsSendingLink(false)
    }
  }

  const requestPasswordResetLink = async () => {
	setError("")
	if(!email) {
		setError("Email is required")
	}
	try {
		await forgotPasswordLink(email)
		setAlert("Password Reset Link sent! Check your email or spam folder.")
	} catch (error) {
		setError("Something went wrong while requesting for link")
	} 
  }

  if (user) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#1A1F36] rounded-full p-3">
              <Feather className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your blog
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {alert && (
              <Alert variant="destructive" className="text-green-500">
                <AlertDescription className="flex items-center justify-between text-green-500">
                  {alert}
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button size="xs" variant="link" type="button" className="text-gray-500" onClick={requestPasswordResetLink}>
              Forgot Password?
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full mt-4 bg-[#1A1F36] hover:bg-[#252D45]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
        {showResend && (
          <div className="p-1 flex justify-center items-center">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-600 text-white hover:bg-green-500 hover:text-white"
              onClick={handleResendVerificationEmail}
              disabled={isSendingLink}
            >
              {!isSendingLink ? "Resend Verification Link" : "Sending"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default LoginPage
