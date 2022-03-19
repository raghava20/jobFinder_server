import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

export const User = mongoose.model("User", userSchema, "users")