import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import ViewPost from "@/pages/ViewPost"
import CreatePost from "@/pages/CreatePost"
import UpdatePost from "@/pages/UpdatePost"
import AllPosts from "@/pages/AllPosts"
import Layout from "@/layouts/Layout"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="posts/:slug" element={<ViewPost />} />
          <Route path="posts" element={<AllPosts />} />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="update/:slug"
            element={
              <ProtectedRoute>
                <UpdatePost />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
