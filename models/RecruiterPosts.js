import mongoose from "mongoose"

const recruiterPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    salary: {
        type: String,
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    apply: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

export const RecruiterPost = mongoose.model('RecruiterPost', recruiterPostSchema, "recruiterPost")