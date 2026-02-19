import express from "express"
import { deleteUser, getUserProfile } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/profile/:id", getUserProfile)
router.post("/delete", deleteUser)

export default router