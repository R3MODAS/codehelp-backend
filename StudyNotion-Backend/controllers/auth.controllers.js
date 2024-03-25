const UserModel = require("../models/user.models")
const OtpModel = require("../models/otp.models")
const ProfileModel = require("../models/profile.models")
const OtpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// SendOTP
exports.sendOTP = async (req, res) => {
    try {
        // get email from user
        const { email } = req.body

        // validation of data
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            })
        }

        // check if user already exists or not
        const checkUser = await UserModel.findOne({ email })

        if (checkUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }

        // Generate OTP
        let GeneratedOTP = OtpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("Generated OTP: ", GeneratedOTP)

        // Checking if the OTP is unique or not
        let checkOTP = await OtpModel.findOne({ otp: GeneratedOTP })

        while (checkOTP) {
            GeneratedOTP = OtpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            checkOTP = await OtpModel.findOne({ otp: GeneratedOTP })
        }

        // Create an entry of OTP in the DB
        const otpBody = await OtpModel.create({ email, otp })
        console.log("OTP: ", otpBody)

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
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
exports.signup = async (req, res) => {
    try {
        // fetch data from request body
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body

        // Validation of the data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if password and confirm password matches
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password does not match"
            })
        }

        // check if the user already exists or not
        const checkUser = await UserModel.findOne({ email })
        if (checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // finding the recent OTP stored in the db
        const recentOtp = await OtpModel.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(recentOtp)

        // recent OTP validation
        if (recentOtp.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }

        else if (otp !== recentOtp[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        // Hashing the password before storing into the db
        try {
            const hashedPassword = await bcrypt.hash(password, 10)

            // entry created in DB
            const ProfileDetails = await ProfileModel.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null
            })

            const createdUser = await UserModel.create({
                firstName,
                lastName,
                email,
                contactNumber,
                password: hashedPassword,
                accountType,
                additionalDetails: ProfileDetails._id,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
            })

            return res.status(201).json({
                success: true,
                createdUser,
                message: "User is registered successfully"
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to Hash the Password"
            })
        }


    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Login
exports.login = async (req, res) => {
    try {
        // fetch data from request body 
        const { email, password } = req.body

        // Validation of the data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Password is incorrect"
            })
        }

        // Check if user already exists in the db or not
        const checkUser = await UserModel.findOne({ email }).populate("additionalDetails")

        if (!checkUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Match the passwords from the user and db one and generate JWT
        if (await bcrypt.compare(password, checkUser.password)) {
            const token = jwt.sign(
                {
                    id: checkUser._id,
                    email: checkUser.email,
                    accountType: checkUser.accountType
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            )

            // Send the token in the form of cookie and sending the response to the user
            res.cookie("token", token,
                {
                    httpOnly: true,
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                }).status(200).json({
                    success: true,
                    token,
                    user: {
                        id: checkUser.id,
                        email: checkUser.email,
                        accountType: checkUser.accountType,
                        image: checkUser.image
                    },
                    message: "Logged in successfully"
                })

        }
        else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            })
        }

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: "Login Failure"
        })
    }
}

// Change Password
exports.changePassword = async (req, res) => {
    try {
        // get oldPassword, newPassword, confirmNewPassword from req body
        const { oldPassword, newPassword, confirmNewPassword } = req.body

        // validation of data
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide oldPassword, newPassword, and confirmNewPassword"
            });
        }

        // verify whether new password matches confirm new password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        // verify the old password
        const checkOldPassword = await bcrypt.compare(oldPassword, user.password);
        if (!checkOldPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update password in db
        

        // send mail - Password updated
        // return response 
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }


}