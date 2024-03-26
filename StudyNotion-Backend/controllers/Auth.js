const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")

const User = require("../models/User")
const Otp = require("../models/Otp")
const Profile = require("../models/Profile")

// SendOTP
exports.sendOTP = async (req, res) => {
    // getting the data from the request body (user)
    const { email } = req.body

    // validation of the data
    if (!email) {
        return res.status(401).json({
            success: false,
            message: "Email is incorrect"
        })
    }

    // check if the user already exists in the db or not
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(401).json({
            message: 'User is already registered',
            success: false
        })
    }

    // generate otp
    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
    console.log(otp)

    // check if the otp is unique or not
    let result = Otp.findOne({ otp })
    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        result = await Otp.findOne({ otp })
    }

    // entry of otp in the db
    const otpBody = await Otp.create({ otp, email })
    console.log(otpBody)

    // return the response
    return res.status(200).json({
        success: true,
        message: "OTP sent Successfully",
        otp
    })
}

// Signup
exports.signUp = async (req, res) => {
    try {
        // get the data from request body (user)
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body

        // validation of the data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required fields'
            });
        }

        // check if the password matches with the confirm password or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password do not match , please try again'
            });
        }

        // check if the user already exists in the db or not
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            })
        }

        // find the most recent OTP
        const recentOTP = await Otp.find({email}).sort({createdAt: -1}).limit(1)
        console.log(recentOTP)

        // validate the OTP
        if(recentOTP.length === 0){
            return res.status(400).json({
                success: false,
                message: "Please try for a new OTP"
            })
        }

        else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            })
        }

        // hash the password
        const hashedpassword = await bcrypt.hash(password, 10)

        // create entry in the db on Profile Model (for Additional Details)
        const profileDetails = await Profile.create({
            gender: null,
            contactNumber: null,
            about: null,
            dateOfBirth: null
        })

        // create entry in the db on User Model (for User)
        const createdUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedpassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${firstName} ${lastName}`
        })

        // return the response
        return res.json({
            success: true,
            message: "User has been registered Successfully"
        })

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: 'Something went wrong while signing up',
            success: false
        });
    }
}

// Login

// Change Password