const User = require("../models/User")
const Otp = require("../models/Otp")
const otpGenerator = require("otp-generator")

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        // get the email from request body (user)
        const { email } = req.body

        // verification of the email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        // check if the user is already registered in the db or not
        const checkExistingUser = await User.findOne({ email: email })

        if (checkExistingUser) {
            return res.status(401).json({
                success: false,
                message: 'User is already registered, Please visit the Login page'
            })
        }

        // generate an unique OTP
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

        // create an entry for the otp in db
        const otpBody = await Otp.create({ email: email, otp: otp })

        // return the response
        return res.status(200).json({
            success: true,
            message: "Otp is sent Successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the OTP",
            error: err.message
        })
    }
}

// Signup
exports.signup = async (req,res) => {
    // get the data from the request body
    // validation of the data
    // check if password and confirmPassword matches or not
    // check if the user already exists or not
    // find the recentmost OTP
    // validation of the otp (otp model empty/not and user gave the correct otp/not)
    // hash the password
    // create entry in profile model
    // create entry in user model
    // return the response
}