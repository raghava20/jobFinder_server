import mongoose from "mongoose"

export const mongo = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongodb is connected")
    }
    catch (err) {
        process.exit()
    }
}