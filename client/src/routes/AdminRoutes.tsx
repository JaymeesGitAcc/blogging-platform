import AdminDashboard from "@/pages/AdminDashboard"
import { Route, Routes } from "react-router-dom"

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin">
        <Route index element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes
