import express from "express"
import { getAllProfiles, getUserProfileById } from "../controllers/profileController.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

router.get("/", auth, getAllProfiles)

router.get("/user/:id", auth, getUserProfileById)

export const profileRouter = router;

