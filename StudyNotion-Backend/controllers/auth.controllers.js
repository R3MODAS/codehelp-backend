const UserModel = require("../models/user.models")
const OtpModel = require("../models/otp.models")
const OtpGenerator = require("otp-generator")

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

// Login

// Change Password