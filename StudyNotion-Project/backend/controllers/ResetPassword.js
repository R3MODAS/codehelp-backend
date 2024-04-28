const User = require("../models/User")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { mailer } = require("../utils/mailer")
const { resetPassword } = require("../mail/resetPassword")

// Reset Password Token
exports.ResetPasswordToken = async (req, res) => {
    try {
        // get email from request body
        const { email } = req.body

        // validation of the data
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        // check if the user exists in the db or not
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            })
        }

        // generate an unique token
        const token = crypto.randomUUID()

        // update the token and token expiry for the user in db
        await User.findByIdAndUpdate(
            { _id: user._id },
            {
                forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 5 * 60 * 1000
            },
            { new: true }
        )

        // create an url for user to reset password
        const url = `http://localhost:${process.env.PORT}/api/v1/auth/reset-password/${token}`

        // send the mail to the user
        await mailer(email, `Reset Password Link | StudyNotion`, `Your Link for reset password is ${url}. Please click this url to reset your password.`)

        // return the response
        return res.status(200).json({
            success: true,
            message: "Reset password link sent successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the reset password link",
            error: err.message
        })
    }
}

// Reset Password
exports.ResetPassword = async (req, res) => {
    try {
        // get email from request body
        const { password, confirmPassword, token } = req.body

        // validation of the data
        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if password and confirm password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password doesn't match"
            })
        }

        // validation of the token
        const user = await User.findOne(
            {
                forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() }
            })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }

        // encrypt the new password and update it to the db
        const newEncryptedPass = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(
            {_id: user._id},
            {password: newEncryptedPass},
            {new: true}
        )

        // send the mail to the user
        await mailer(user.email, `Password Reset Done Successfully`, resetPassword(user.email, `${user.firstName} ${user.lastName}`))

        // return the response
        return res.status(200).json({
            success: true,
            message: "Password reset done successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the reset password link",
            error: err.message
        })
    }
}
