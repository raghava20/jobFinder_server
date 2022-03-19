import express from "express"
import { login, signUp, verifyUser, getUserData } from "../controllers/authController.js"
import { auth } from "../middleware/auth.js"

let router = express.Router()

router.post("/signup", signUp)

router.post("/login", login)

router.get("/verify/:token", verifyUser)

router.get('/auth', auth, getUserData)


export const authenticationRouter = router;