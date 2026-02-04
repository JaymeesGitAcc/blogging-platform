import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import SmallScreenNav from "@/components/SmallScreenNav"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div>
      <Navbar />
      <SmallScreenNav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
