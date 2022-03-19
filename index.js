import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import { mongo } from "./connection.js"
import { authenticationRouter } from "./routers/authenticationRouter.js";
import { postRouter } from "./routers/postRouter.js";
import { profileRouter } from "./routers/profileRouter.js";


// env file config
dotenv.config()

const app = express()
let PORT = process.env.PORT || 3001

//middleware
app.use(express.json())
app.use(cors())

//database connection - (mongodb)
mongo()

app.get("/", (req, res) => {
    res.send("You are listening on Job poster API!!!")
})

app.use("/", authenticationRouter)
app.use("/post", postRouter)
app.use("/profile", profileRouter)

app.listen(PORT, () => console.log("listening on port: " + PORT))