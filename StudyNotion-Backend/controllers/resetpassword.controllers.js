const UserModel = require("../models/user.models")
const mailSender = require("../utils/mailer")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        // get email from req.body
        const { email } = req.body

        // validation of email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is incorrect"
            })
        }

        // verify user exists or not
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exists"
            })
        }

        // generate token
        const token = crypto.randomUUID()

        // update user by adding token and expiration time
        const updatedDetails = await UserModel.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            { new: true })

        // create url
        const url = `http://localhost:${process.env.PORT}/update-password/${token}`

        // send mail containing the url
        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`)

        // return response
        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        // fetch the data
        const {password, confirmPassword, token} = req.body

        // validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password does not match"
            })
        }

        // get user details using the token
        const userDetails = await UserModel.findOne({token: token})

        // if no entry for the token -> invalid token
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "Token is invalid"
            })
        }

        // token expiring time checking
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token has expired, please regenerate your token"
            })
        }

        // hash the new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // update the password in db
        await UserModel.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )

        // return response
        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}