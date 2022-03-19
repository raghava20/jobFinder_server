import { Account } from "../models/Account.js";
import { RecruiterPost } from "../models/RecruiterPosts.js";
import { User } from "../models/User.js";

// job post by recruiter
export const postJob = async (req, res) => {
    try {
        const { title, jobType, description, salary, companyName, location } = req.body;
        let postGroup = {}

        console.log(req.user)
        postGroup.user = req.user;

        if (title) postGroup.title = title;
        if (jobType) postGroup.jobType = jobType;
        if (description) postGroup.description = description;
        if (salary) postGroup.salary = salary;
        if (companyName) postGroup.companyName = companyName;
        if (location) postGroup.location = location;

        const result = new RecruiterPost(postGroup)
        await result.save()
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get all RecruiterPosts
export const getAllPosts = async (req, res) => {
    try {
        const result = await RecruiterPost.find().sort({ date: -1 })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get post by id
export const getPostById = async (req, res) => {
    try {
        const result = await RecruiterPost.findById(req.params.id)
        if (!result) return res.status(404).json({ message: "Not found" })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get all job post by a single recruiter
export const getAllPostByRecruiter = async (req, res) => {
    try {
        const result = await RecruiterPost.find({ user: req.user })
        if (!result) return res.status(400).json({ message: "Not found" })
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// apply job on the post
export const applyJobByUser = async (req, res) => {
    try {
        const result = await RecruiterPost.findById(req.params.id)
        if (result.apply.filter(apply => apply.user.toString() === req.user).length > 0) {
            return res.status(400).json({ message: "Applied already" })
        }
        result.apply.unshift({ user: req.user })
        await result.save()
        res.status(200).json(result.apply)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const getAllApplicants = async (req, res) => {
    try {
        const result = await RecruiterPost.find({})
        res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

export const appliedPostOnUser = async (req, res) => {
    try {
        const response = await Account.findById(req.user)
        console.log(response, "db resp")
        if (response.appliedJobs.filter(jobs => jobs.jobPost.toString() === req.params.id).length > 0) {
            return res.status(403).json({ message: "Already Applied Job" })
        }
        response.appliedJobs.unshift({ jobPost: req.params.id })
        await response.save()
        console.log(response, response.appliedJobs, "next")
        res.status(200).json(response.appliedJobs)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}