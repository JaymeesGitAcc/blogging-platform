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
import { Eye, EyeOff, Mail, Lock, PenLine } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const LoginPage = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

  const {login} = useAuth()
  const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError("")
		setLoading(true)

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
      await login(email, password);
      toast.success("You are logged in Successfully")
      navigate("/"); // redirect to home after login
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-center mb-4">
						<div className="bg-primary rounded-full p-3">
							<PenLine className="h-6 w-6 text-primary-foreground" />
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
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
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

						<div className="flex items-center justify-between text-sm">
							<a href="#" className="text-primary hover:underline">
								Forgot password?
							</a>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full mt-4" disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>

						<div className="text-sm text-center text-muted-foreground">
							Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">Sign Up</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
}

export default LoginPage
