const User = require("../models/User")
const sendEmail = require("../utils/mailer")

const bcrypt = require("bcrypt")
const crypto = require("crypto")

// reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        // get email from request body
        const { email } = req.body

        // validation of email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Email"
            })
        }

        // check if user exists in the db or not
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            })
        }

        // generate token for each user
        const token = crypto.randomUUID()

        // update the user by adding generated token and expiration time to the individual user
        const updatedUserDetails = await User.findOneAndUpdate(
            { email: email },
            { forgetPasswordToken: token, forgetPasswordTokenExpiry: Date.now() + 5 * 60 * 1000 },
            { new: true })

        // create url
        const url = `http://localhost:${process.env.PORT}/update-password/${token}`

        // send the mail containing the url
        await sendEmail(email, "Password Reset", `Your Link for email verification is ${url}. Please click this url to reset your password`)

        // return the response
        return res.status(200).json({
            success: true,
            message: "Email for password reset sent successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password"
        });
    }
}

// reset Password
exports.resetPassword = async (req, res) => {
    try {
        // get password, confirmPassword, token from request body
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

        // get userDetails from db using token
        const userDetails = await User.findOne({ forgetPasswordToken: token })

        // validation of token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        // check for token expiry time
        if (userDetails.forgetPasswordTokenExpiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token has expired, please regenerate your token"
            })
        }

        // hashing the new password
        const hashedpassword = bcrypt.hash(password, 10)

        // updating the password in db
        const updatedUserDetails = await User.findOneAndUpdate(
            { forgetPasswordToken: token },
            { password: hashedpassword },
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

