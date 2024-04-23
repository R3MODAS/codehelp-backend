const User = require("../models/User")
const Otp = require("../models/Otp")
const Profile = require("../models/Profile")

const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { mailer } = require("../utils/mailer")
const { updatePassword } = require("../mail/updatePassword")

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        // get data from request body
        const { email } = req.body

        // validation of the data
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        // check if the user already exists in the db or not
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            })
        }

        // generate an unique otp
        let otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false
        })

        // check for unique otp
        let result = await Otp.findOne({ otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false
            })
            result = await Otp.findOne({ otp })
        }

        // create an entry for otp in db
        await Otp.create({ otp, email })

        // return the response
        return res.status(200).json({
            success: true,
            message: "Otp sent successfully"
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the otp",
            error: err.message
        })
    }
}

// Signup
exports.Signup = async (req, res) => {
    try {
        // get data from request body
        const { firstName, lastName, email, password, confirmPassword, contactNumber, accountType, otp } = req.body

        // validation of the data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !accountType || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if password and confirm password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password doesn't match"
            })
        }

        // check if the user already exists in the db or not
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            })
        }

        // find the recent otp
        const recentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)

        // validation of the otp
        if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid Otp"
            })
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // create an entry for profile in db
        const profileDetails = await Profile.create({
            about: null,
            contactNumber: null,
            dateOfBirth: null,
            gender: null
        })

        // create an entry for user in db
        const userDetails = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // excluded the password before sending it on response
        userDetails.password = undefined

        // return the response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            userDetails
        })
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user",
            error: err.message
        })
    }
}

// Login
exports.Login = async (req, res) => {
    try {
        // get data from request body
        const { email, password } = req.body

        // validation of the data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the user exists in the db or not
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            })
        }

        // compare the user password and db password
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        // generate a jwt token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                accountType: user.accountType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        )

        // Add the token and remove the password
        user.token = token
        user.password = undefined

        // create a cookie and return the response
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
            .status(200)
            .json({
                success: true,
                message: "User logged in successfully",
                token,
                user
            })

    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the otp",
            error: err.message
        })
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        // get the user id from req.user (passed by auth middleware) and get the user details
        const userDetails = await User.findById(req.user.id)

        // get data from request body
        const { oldPassword, newPassword, confirmNewPassword } = req.body

        // validation of the data
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if new password and confirm new password matches or not
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and Confirm new password doesn't match"
            })
        }

        // compare the user password and db password
        const comparePassword = await bcrypt.compare(oldPassword, userDetails.password)
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            })
        }

        // encrypt the new password and update it on db
        const newEncryptedPass = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(
            { _id: userDetails._id },
            { password: newEncryptedPass },
            { new: true }
        )

        // send the mail to the user 
        try {
            await mailer(userDetails.email, "Password Changed Successfully | StudyNotion", updatePassword(userDetails.email, `${userDetails.firstName} ${userDetails.lastName}`))
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Failed to send the mail to the user"
            })
        }

        // return the response
        return res.status(200).json({
            success: true,
            message: "Changed password successfully"
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while changing the password",
            error: err.message
        })
    }
}