import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { authorizeRoles } from "../middlewares/role.middleware.js"
import { sendEmail } from "../utils/sendEmail.js"

const router = express.Router()

router.get("/me", protect, (req, res) => {
  return res.json({
    message: "User authenticated",
    user: req.user,
  })
})

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  return res.json({
    message: "Welcome Admin",
    admin: req.user,
  })
})

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "andrewjames31199@gmail.com",
      "Test Email from MERN Blog App",
      "<h2>Email system is working 🎉</h2>",
    )

    return res.send("Test email sent!")
  } catch (error) {
    return res.status(500).send("Email failed")
  }
})

export default router
