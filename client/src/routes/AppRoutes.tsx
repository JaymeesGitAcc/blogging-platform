import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import ViewPost from "@/pages/ViewPost"
import CreatePost from "@/pages/CreatePost"

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/:slug" element={<ViewPost />}/>
				<Route
					path="/create"
					element={
						<ProtectedRoute>
							<CreatePost />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
