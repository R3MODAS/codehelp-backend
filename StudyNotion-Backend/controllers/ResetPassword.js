const User = require("../models/User")
const mailer = require("../utils/mailer")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        // get email from request body (user)
        const { email } = req.body

        // validation of the data
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
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

        // generate a random token using crypto package
        const token = crypto.randomUUID()

        // update the user model in the db by inserting the token and expiry time for the token
        await User.findByIdAndUpdate(
            { _id: user._id },
            { forgetPasswordToken: token, forgetPasswordTokenExpiry: Date.now() + 5 * 60 * 1000 },
            { new: true })

        // create a url for updating the password using the token of specific user
        const url = `http://localhost:${process.env.PORT}/update-password/${token}`

        // send the url to the user using the mail
        await mailer(email, "Reset Password from StudyNotion", `Your Link for email verification is ${url}. Please click this url to reset your password.`)

        //return the response
        return res.status(200).json({
            success: true,
            message: "Reset password mail has been sent successfully",
        });

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the token for reset password",
            error: err.message
        })
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        // get password, confirmPassword and token from request body (user)
        const { password, confirmPassword, token } = req.body

        // validation of the data
        if (!password || !confirmPassword || !token) {
            return res.status(400).json({
                success: false,
                message: "Please fill the details properly"
            })
        }

        // check if password and confirm password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password don't match"
            });
        }

        // validation for the token
        const userDetails = await User.findOne({ forgetPasswordToken: token })
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        // check if the token expiry time has expired or not
        if (userDetails.forgetPasswordTokenExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token has expired"
            });
        }

        // hash the password
        const newEncryptedPassword = await bcrypt.hash(password, 10)

        // update the user model in db with new password
        await User.findByIdAndUpdate(
            { _id: userDetails._id },
            { password: newEncryptedPassword },
            { new: true }
        )

        //return the response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password",
            error: err.message
        })
    }
}