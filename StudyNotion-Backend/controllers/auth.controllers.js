const UserModel = require("../models/user.models")
const OtpModel = require("../models/otp.models")
const ProfileModel = require("../models/profile.models")
const OtpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// SendOTP
exports.sendOTP = async (req, res) => {
    try {

        // get email from request body 
        const { email } = req.body

        // check if user already exists or not
        const checkUser = await UserModel.findOne({ email: email })

        if (checkUser) {
            return res.status(401).json({
                success: false,
                message: "User is already registered"
            })
        }

        // generate otp
        let otp = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("OTP generated: ", otp)

        // should be an unique otp or not
        let result = await OtpModel.findOne({ otp: otp })

        // generating unique otp
        while (result) {
            otp = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OtpModel.findOne({ otp: otp })
        }

        // creating an entry for Otp in db
        const otpBody = OtpModel.create({ email, otp })
        console.log("OTPBODY: ", otpBody)

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Signup
exports.signup = async (req, res) => {
    try {

        // data fetch from request.body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body

        // validate the data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        // password and confirm password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords does not match"
            })
        }

        // check if the user already exists or not
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            })
        }

        // find most recent OTP stored for the user from db
        const recentOtp = await OtpModel.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(recentOtp)

        // validate OTP
        if (recentOtp.length === 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if (otp !== recentOtp.otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // entry created in DB
        const ProfileDetails = await ProfileModel.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: ProfileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Login
exports.login = async (req, res) => {
    try {
        // get data from req body
        const { email, password } = req.body

        // validation of data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/password is incorrect"
            })
        }

        // check user if it exists or not
        const user = await UserModel.findOne({ email }).populate("additionalDetails")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // match the password and generate jwt
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })

            user.token = token
            user.password = undefined

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            // create cookie and send response
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            })
        }
        else {
            return res.status(403).json({
                success: false,
                message: 'Incorrect password'
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Login Failure"
        })
    }
}

// Change Password
exports.changePassword = async (req,res) => {
    // get data from req body 
    // get oldPassword, newPassword, confirmNewPassword
    // validation of data

    // update password in db
    // send mail - Password updated
    // return response 
}