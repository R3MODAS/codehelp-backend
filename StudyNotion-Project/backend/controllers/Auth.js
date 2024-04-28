const User = require("../models/User")
const Profile = require("../models/Profile")
const Otp = require("../models/Otp")

const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { mailer } = require("../utils/mailer")
const {updatePassword} = require("../mail/updatePassword")

// Send Otp
exports.SendOtp = async (req, res) => {
    try {
        // get email from request body
        const { email } = req.body

        // validation of the email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        // check if the user already exists in the db or not
        const user = await User.findOne({ email: email })
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

        // validation for unique otp
        let result = await Otp.findOne({ otp: otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false
            })
            result = Otp.findOne({ otp: otp })
        }

        // create an entry for otp in db
        await Otp.create({ otp, email })

        // return the response
        return res.status(200).json({
            success: true,
            message: "Otp sent successfully",
            otp
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
        const { firstName, lastName, email, accountType, contactNumber, password, confirmPassword, otp } = req.body

        // validation of the data
        if (!firstName || !lastName || !email || !accountType || !contactNumber || !password || !confirmPassword || !otp) {
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
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            })
        }

        // find the recent otp from db
        const recentOtp = await Otp.find({ email: email }).sort({ createdAt: -1 }).limit(1)

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
            accountType,
            additionalDetails: profileDetails._id,
            email,
            password: hashedPassword,
            image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName} ${lastName}`
        })

        // remove the password before sending it as response
        userDetails.password = undefined

        // return the response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            userDetails
        })
    } catch (err) {
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
        // get email and password from request body   
        const { email, password } = req.body

        // validation of the data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Password is required"
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
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        // create a payload for token
        const payload = {
            id: user._id,
            email: user.email,
            accountType: user.accountType
        }

        // generate a token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })

        // remove the password and set token
        user.token = token
        user.password = undefined

        // create options for cookie
        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000))
        }

        // create a cookie and return the response
        res.cookie("token", token, options).status(200).json({
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
            message: "Something went wrong while logging in the user",
            error: err.message
        })
    }
}

// Change Password
exports.ChangePassword = async (req, res) => {
    try {
        // get user details using user id (from auth middleware)
        const userDetails = await User.findById({ _id: req.user.id })

        // get data from request body
        const { oldPassword, newPassword, confirmNewPassword } = req.body

        // validation of the data
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if old password and db password matches or not
        const validPassword = await bcrypt.compare(oldPassword, userDetails.password)
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Incorrect old password"
            })
        }

        // check if new password and confirm new password matches or not
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm new password doesn't match"
            })
        }

        // encrypt the new password and update it to the db
        const newEncryptedPass = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(
            { _id: userDetails._id },
            { password: newEncryptedPass },
            { new: true }
        )

        // send the mail to the user regarding this change of password
        await mailer(userDetails.email, `Password Changed Successfully | StudyNotion`, updatePassword(userDetails.email, `${userDetails.firstName} ${userDetails.lastName}`))

        // return the response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
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