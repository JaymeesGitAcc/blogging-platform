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
import AdminDashboard from "@/pages/AdminDashboard"
import UserProfile from "@/pages/UserProfile"
import { ScrollToTop } from "@/utils/ScrollToTop"
import AccessDenied from "@/pages/AccessDenied"
import NotFound from "@/pages/NotFound"
import AuthProvider from "@/contexts/AuthContext"
import VerifyEmail from "@/pages/VerifyEmail"
import ResetPassword from "@/pages/ResetPassword"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
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
            <Route path="profile/:id" element={<UserProfile />} />
            <Route path="accessdenied" element={<AccessDenied />} />
            <Route path="verify-email" element={<VerifyEmail />}/>
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/admin">
            <Route
              index
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
