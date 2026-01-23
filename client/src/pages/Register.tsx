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
import { Eye, EyeOff, Mail, Lock, User, PenLine } from "lucide-react"
import { api } from "@/lib/api"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "@/services/auth.api"
import { toast } from "sonner"

export default function Register() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		if (!name || !email || !password) {
			setError("Please fill in all fields")
			setLoading(false)
			return
		}

		if (name.trim().length < 2) {
			setError("Name must be at least 2 characters long")
			setLoading(false)
			return
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address")
			setLoading(false)
			return
		}

		// Password validation
		if (password.length < 6) {
			setError("Password must be at least 6 characters long")
			setLoading(false)
			return
		}

		try {
			const response = await registerUser(name, email, password)
			if(response) {
				toast.success("User Registered Successfully", { position: "bottom-right" })
				navigate("/login")
			}
		} catch (err) {
			setError("Failed to create account. Please try again.")
		} finally {
			setLoading(false)
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
						Create an account
					</CardTitle>
					<CardDescription className="text-center">
						Start your blogging journey today
					</CardDescription>
				</CardHeader>
				<div onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<div className="relative">
								<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="pl-10"
									disabled={loading}
								/>
							</div>
						</div>

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
									placeholder="Create a strong password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pl-10 pr-10"
									disabled={loading}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleSubmit(e)
										}
									}}
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
							<p className="text-xs text-muted-foreground">
								Must be at least 6 characters long
							</p>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Button
							onClick={handleSubmit}
							className="w-full mt-4"
							disabled={loading}
						>
							{loading ? "Creating account..." : "Create account"}
						</Button>

						<div className="text-sm text-center text-muted-foreground">
							Already have an account?{" "}
							<Link to="/login" className="text-primary hover:underline font-medium">
								Sign in
							</Link>
						</div>
					</CardFooter>
				</div>
			</Card>
		</div>
	)
}
