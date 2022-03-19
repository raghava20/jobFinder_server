import express from 'express';
import { appliedPostOnUser, applyJobByUser, getAllPostByRecruiter, getAllPosts, getPostById, postJob } from '../controllers/postController.js';
import { auth } from "../middleware/auth.js"

const router = express.Router()

router.get("/", auth, getAllPosts)

router.post("/", auth, postJob)

router.get("/:id", auth, getPostById)

router.put("/:id", auth, applyJobByUser)

router.get("/me", auth, getAllPostByRecruiter)

router.put("/user/:id", auth, appliedPostOnUser)

export const postRouter = router;