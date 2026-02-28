import express from "express"
import { deleteUser, getUserProfile, updateBio } from "../controllers/user.controller.js"
import {protect} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/profile/:id", getUserProfile)
router.post("/delete", deleteUser)
router.post("/update-bio", protect, updateBio)

export default router