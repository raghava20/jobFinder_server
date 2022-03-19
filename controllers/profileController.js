import { Account } from "../models/Account.js";

//get all user's profiles
export const getAllProfiles = async (req, res) => {
    try {
        const result = await Account.find({ role: "candidate" })
        console.log(result, "db")
        return res.status(200).json(result)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}

// get user by userId
export const getUserProfileById = async (req, res) => {
    try {
        const result = await Account.findById(req.params.id)
            .populate("appliedJobs.jobPost", ["title", "companyName"])
        if (!result) res.status(400).json({ message: "Profile is not available" })
        return res.status(200).json(result.appliedJobs)
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}