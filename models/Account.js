import mongoose from "mongoose"

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["recruiter", "candidate"]
    },
    accountVerifyToken: String,
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    appliedJobs: [
        {
            jobPost: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RecruiterPost"
            }
        }
    ]

})

export const Account = mongoose.model('Account', accountSchema, "accounts")