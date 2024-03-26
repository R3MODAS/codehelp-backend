const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")

const User = require("../models/User")
const Otp = require("../models/Otp")
const Profile = require("../models/Profile")
const sendEmail = require("../utils/mailer")
const { updatedPassword } = require("../mail/updatedPassword")

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
exports.signup = async (req, res) => {
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
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            })
        }

        // find the most recent OTP
        const recentOTP = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(recentOTP)

        // validate the OTP
        if (recentOTP.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please try for a new OTP"
            })
        }

        else if (otp !== recentOTP[0].otp) {
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
            success: false,
            error: err.message
        });
    }
}

// Login
exports.login = async (req, res) => {
    try {
        // get email and password as data from request body
        const { email, password } = req.body

        // validation of the data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide the email and password correctly"
            })
        }

        // check whether the user exists in the db or not
        const user = await User.findOne({ email }).populate("additionalDetails")

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // compare password
        const comparepassword = await bcrypt.compare(password, user.password)
        if (!comparepassword) {
            return res.status(403).json({
                success: false,
                message: "Please enter the correct password"
            })
        }

        // create a payload
        const payload = {
            id: user._id,
            email: user.email,
            accountType: user.accountType
        }

        // generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })

        // remove the password and insert the token in the user object
        user.token = token
        user.password = undefined

        // creating cookie and sending response
        const options = {
            httpOnly: true,
            expires: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000))
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Logging in",
            error: err.message
        })
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        // get user id from req.user object we passed in the auth middleware
        const userDetails = await User.findById(req.user.id)

        // get oldPassword, newPassword, confirmNewPassword data from request body
        const { oldPassword, newPassword, confirmNewPassword } = req.body

        // validation of the data
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill the data properly"
            })
        }

        // comparing the old password (from user and from db)
        const compareOldPassword = await bcrypt.compare(oldPassword, userDetails.password)
        if (!compareOldPassword) {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            })
        }

        // check if newPassword and confirmNewPassword matches or not
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "The password and confirm password does not match",
            });
        }

        // updating the password in db
        const newEncryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            { _id: req.user.id },
            { password: newEncryptedPassword },
            { new: true }
        )

        // send mail for updated password
        try {
            const mailResponse = await sendEmail(
                updatedUserDetails.email,
                "Change of Password from StudyNotion",
                updatedPassword(updatedUserDetails.email, `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`)
            )
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error while sending updated password email"
            })
        }

        // returning response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while changing password!",
            error: err.message
        })
    }
}