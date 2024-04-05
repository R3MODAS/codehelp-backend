const User = require("../models/User")
const Otp = require("../models/Otp")
const Profile = require("../models/Profile")

const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const mailer = require("../utils/mailer")
const { updatedPassword } = require("../../StudyNotion-Backend/mail/updatedPassword")

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        // get the email from request body
        const { email } = req.body

        // validation of the email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }

        // check if the email exists in the db or not
        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered, Please move to the Login page"
            })
        }

        // generate an otp
        let otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false
        })

        // check if the otp is unique or not
        let result = await Otp.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false
            })
            result = await Otp.findOne({ otp: otp })
        }

        // create an entry for otp in the db
        const otpBody = await Otp.create({ otp: otp, email: email })

        // return the response
        return res.status(200).json({
            success: true,
            message: "Otp sent successfully"
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the OTP",
            error: err.message
        })
    }
}

// Signup
exports.signup = async (req, res) => {
    try {
        // get the data from request body (user)
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body

        // validation of the data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !contactNumber || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please fill the details properly"
            })
        }

        // check if the password and confirmPassword matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password does not match"
            })
        }

        // check if the user already exists in the db or not
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User is already registered, Please visit the login page"
            })
        }

        // find the recent most otp
        const recentOtp = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1)

        // validation of the otp
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please send Otp again"
            })
        }

        else if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Otp has expired"
            })
        }

        // hash the password to store in the db
        const hashedPassword = await bcrypt.hash(password, 10)

        // create an entry in db for Profile model
        const profileDetails = await Profile.create({
            about: null,
            contactNumber: null,
            dateOfBirth: null,
            gender: null
        })

        // create an entry in db for User model
        const userDetails = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName} ${lastName}`
        })

        // return the response
        return res.status(200).json({
            success: true,
            message: "Signed up successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while signing up",
            error: err.message
        })
    }
}

// Login
exports.login = async (req, res) => {
    try {
        // get email and password from request body (user)
        const { email, password } = req.body

        // validation of the data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email or Password is invalid"
            })
        }

        // check if the user exists in the db or not
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered yet, Please visit the signup page"
            })
        }

        // compare the password with the db password
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        // create a payload for jwt
        const payload = {
            id: user._id,
            email: user.email,
            accountType: user.accountType
        }

        // create a jwt token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        })

        // configuration of user object
        user.token = token
        user.password = undefined

        // send the token in the cookie and return the response
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000))
        }).status(200)
            .json({
                success: true,
                message: "Logged in successfully",
                token,
                user
            })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Logging in",
            error: err.message
        })
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        // get oldPassword, newPassword and confirmNewPassword from request body
        const { oldPassword, newPassword, confirmNewPassword } = req.body

        // validation of data
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter the details properly"
            })
        }

        // get the user details using the req.user object (passed by auth middleware)
        const userDetails = await User.findById(req.user.id)

        // check if old password and db password matches or not
        const comparePassword = await bcrypt.compare(oldPassword, userDetails.password)
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Old Password is incorrect"
            })
        }

        // check if the new password and confirm new password matches or not
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password, please fill the password properly"
            })
        }

        // hash the new password
        const newEncryptedPassword = await bcrypt.hash(newPassword, 10)

        // update the user model in db with the new password
        const updatedUserDetails = await User.findByIdAndUpdate(
            { _id: userDetails._id },
            { password: newEncryptedPassword },
            { new: true })

        // send the mail of updating the password
        try {
            const mailResponse = await mailer(userDetails.email, "Change of Password from StudyNotion", updatedPassword(userDetails.email, `${userDetails.firstName} ${userDetails.lastName}`))
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error while sending updated password email",
                error: err.message
            })
        }

        // returning response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while changing password!",
            error: err.message
        })
    }
}