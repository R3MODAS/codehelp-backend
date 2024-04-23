const bcrypt = require("bcrypt")
const crypto = require('crypto')
const jwt = require("jsonwebtoken")

const User = require("../models/User")
const { mailer } = require("../utils/mailer")
const { resetPassword } = require("../mail/resetPassword")

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        // get data from request body
        const {email} = req.body

        // validation of the data
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        // check if the user exists in the db or not
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            })
        }

        // generate an unique token
        const token = crypto.randomUUID()

        // update the token and token expiry of user in db
        await User.findByIdAndUpdate(
            {_id: user._id},
            {
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: Date.now() + 5 * 60 * 1000
            }
        )

        // create an url for the user
        const url = `http://localhost:${process.env.PORT}/reset-password/${token}`

        // send the mail to the user
        try{
           await mailer(email, "Password Reset", `Your Link for email verification is ${url}. Please click this url to reset your password.`)
        }catch(err){
            return res.status(400).json({
                success: false,
                message: "Failed to send the mail to the user"
            })
        }

        // return the response
        return res.status(200).json({
            success: true,
            message: "Reset password link sent successfully"
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the reset password link",
            error: err.message
        })
    }
}

// Reset Password
exports.resetPassword = async (req,res) => {
    try{
        // get data from request body
        const {password, confirmPassword, token} = req.body

        // validation of the data
        if(!password || !confirmPassword || !token){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if password and confirm password matches or not
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password doesn't match"
            })
        }

        // validation of the token
        const user = await User.findOne(
            {
                forgotPasswordToken: token, 
                forgotPasswordTokenExpiry: {$gt : Date.now()}
            })

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }

        // encrypt the new password and update it on db
        const newEncryptedPass = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(
            {_id: user._id},
            {password: newEncryptedPass},
            {new: true}
        )

        // send the mail to the user
        try{
            await mailer(email, "Password Updated Successfully | StudyNotion", resetPassword(email, `${user.firstName} ${user.lastName}`))
        }catch(err){

        }

    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password",
            error: err.message
        })
    }
}