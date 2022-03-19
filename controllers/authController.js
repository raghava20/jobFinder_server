import bcrypt from "bcrypt"
import sgMail from "@sendgrid/mail"
import jwt from "jsonwebtoken"
import { Account } from "../models/Account.js";
import { User } from "../models/User.js";
import dotenv from "dotenv"

dotenv.config()

const CLIENT_URL = "http://localhost:8000"

// signup the user
export const signUp = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;

        Account.findOne({ email: email }).then(account => {
            if (account) return res.status(401).json({ message: "Email already exists!" })
        })

        //password hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //creating jwt token for verifying account
        const token = jwt.sign({ id: email }, process.env.JWT_SECRET_KEY, { expiresIn: "1hr" })

        const account = new Account({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            accountVerifyToken: token
        })

        const response = await account.save()

        //giving account to the user
        const user = new User({
            account: response
        })

        const result = await user.save()

        // sendgrid package for sending email notification
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: email, // Change to your recipient
            from: process.env.SENDGRID_ACC_EMAIL, // Change to your verified sender
            subject: "Verify your Account on Job Poster",
            html: `<p>Please verify your email by clicking on the link below - Job Poster</p>
                    <a href="${CLIENT_URL}/verify/${token}">link</a>
                    `
        }
        sgMail.send(msg).then(() => {
            console.log(token)
            return res.status(201).json({
                message: "User Signed-up successfully, please verify your email before logging in",
                userId: result._id
            })
        }).catch(err => {
            res.status(500).json({ message: err })
        })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}


// verifying the user before logging in
export const verifyUser = (req, res) => {
    const { token } = req.params;
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
            if (err) res.status(402).json({ message: err })
            Account.findOne({ accountVerifyToken: token })
                .then(account => {
                    if (!account) res.status(403).json({ message: "User with this token does not exist" })
                    account.isAccountVerified = true;
                    account.accountVerifyToken = undefined;
                    return account.save();
                })
                .then(account => {
                    return res.json({ message: "Account verified successfully!" })
                })
                .catch(err => res.status(500).json({ message: err }))
        })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}


// logging up the user
export const login = (req, res) => {
    const { email, password } = req.body;
    let loadUser;

    Account.findOne({ email: email })
        .then(account => {
            if (!account) return res.status(403).json({ message: "Invalid Credentials" })
            loadUser = account;
            return bcrypt.compare(password, account.password)
        })
        .then(isEqual => {
            if (!isEqual) return res.status(403).json({ message: "Invalid Credentials" })
            if (loadUser.isAccountVerified === false) return res.status(403).json({ message: "Verify the email before logging in" })

            // creating token for the user to stay online
            const token = jwt.sign({ accountId: loadUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "10hr" })
            return res.status(201).json({ message: "LoggedIn Successfully", token: token })
        })
        .catch(err => {
            res.status(500).json({ message: err })
        })
}


// get loggedin user Data
export const getUserData = async (req, res) => {
    try {
        const result = await Account.findById(req.user)
        const user = await User.findOne({ account: result._id }).populate({
            path: "account",
            select: ["email", "name", "role"]
        })
        res.status(200).json({ user })
    }
    catch (err) {
        res.status(500).json({ message: err })
    }
}