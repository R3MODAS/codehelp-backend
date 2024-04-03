const User = require("../models/User")
const Otp = require("../models/Otp")
const Profile = require("../models/Profile")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// send otp
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

// signup
exports.signup = async (req, res) => {
    try{
        // get the data from the request body
    const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body

    // validation of the data
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
        return res.status(400).json({
            success: false,
            message: "Please provide the data properly"
        })
    }

    // check if password and confirmPassword matches or not
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password does not match"
        })
    }

    // check if the user already exists or not
    const user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User is already registered, Please visit the login page"
        })
    }

    // find the recent most OTP
    const recentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)

    // validation of the otp (otp model empty/not and user gave the correct otp/not)
    if (recentOtp.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No recent OTP are found"
        })
    }

    else if (otp !== recentOtp[0].otp) {
        return res.status(400).json({
            success: false,
            message: "Otp has expired"
        })
    }

    // hash the password
    const hashedpassword = bcrypt.hash(password, 10)

    // create entry in profile model
    const profileDetails = await Profile.create({
        about: null,
        contactNumber: null,
        dateOfBirth: null,
        gender: null
    })

    // create entry in user model
    const userDetails = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedpassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName} ${lastName}`
    })

    // return the response
    return res.status(200).json({
        success: true,
        message: "Signed up successfully",
        userDetails
    })

    }catch(err){
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while signing up",
            error: err.message
        })
    }
}

// login
exports.login = async (req, res) => {
    try{
        // get the data from request body (user)
    const { email, password } = req.body

    // validation of the data
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email/Password is not valid"
        })
    }

    // check if the user already exists or not
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User is not registered"
        })
    }

    // compare the password
    if (!bcrypt.compare(password, user.password)) {
        return res.status(400).json({
            success: false,
            message: "Incorrect Password"
        })
    }

    // create a payload for jwt
    const payload = {
        id: user._id,
        email: user.email,
        accountType: user.accountType
    }

    // create a token using jwt
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })
    user.token = token
    user.password = undefined

    // create a cookie and return the response
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000))
    }

    res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully"
    })
    }catch(err){
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",
            error: err.message
        })
    }
}

// change password
exports.changePassword = async (req,res) => {
    try{

    }catch(err){
        
    }
}