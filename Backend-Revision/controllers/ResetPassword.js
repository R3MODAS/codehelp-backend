const User = require("../models/User")
const crypto = require("crypto")
const mailer = require("../utils/mailer")
const bcrypt = require("bcrypt")

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        // get the email from request body
        const { email } = req.body

        // validation of the email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        // check if the user exists in the db or not
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // generate unique token for the user
        const token = crypto.randomUUID()

        // update the user details in the user model with generated token and expiryTime for the token
        const updatedUserDetails = await User.findOneAndUpdate(
            { email: email },
            { forgetPasswordToken: token, forgetPasswordTokenExpiry: Date.now() + 5 * 60 * 1000 },
            { new: true })

        // create an url for the user to reset password
        const url = `http://localhost:${process.env.PORT}/${token}`

        // send the mail along with the url to the user
        await mailer(email, "Reset Password by StudyNotion", `Your Link for email verification is ${url}. Please click this url to reset your password`)

        // return the response
        return res.status(200).json({
            success: true,
            message: "Email for Reset password is sent successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password"
        });
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        // get password, confirmPassword and token from request body (user)
        const { password, confirmPassword, token } = req.body

        // validation of the data
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill the password properly"
            })
        }

        // check if password and confirmPassword matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password does not match"
            })
        }

        // get user details using the token
        const userDetails = await User.findOne({ forgetPasswordToken: token })

        // validation of the token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        // check whether the token has expired or not
        if (userDetails.forgetPasswordTokenExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token has expired, please regenerate your token"
            })
        }

        // hash the new password
        const newEncryptedPassword = bcrypt.hash(password, 10)

        // update the user with the new password
        const updatedUserDetails = await User.findOneAndUpdate(
            { forgetPasswordToken: token },
            { password: newEncryptedPassword },
            { new: true })


        // return the response
        return res.status(200).json({
            success: false,
            message: "Password updated successfully"
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password"
        });
    }
}