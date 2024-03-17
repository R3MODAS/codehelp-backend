const UserModel = require("../models/user.models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Something is wrong with the data"
            })
        }

        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing the password"
            })
        }

        const createdUser = await UserModel.create({
            email, name, password: hashedPassword, role
        })

        return res.status(201).json({
            success: true,
            data: createdUser,
            message: "User has been created successfully !!"
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/password is incorrect"
            })
        }

        const User = await UserModel.findOne({ email })

        if (!User) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const payload = {
            email: User.email,
            id: User._id,
            role: User.role
        }

        if (await bcrypt.compare(password, User.password)) {
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            )

            const userdata = {
                _id: User._id,
                name: User.name,
                email: User.email,
                role: User.role,
                token: token
            }

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userdata,
                message: "User logged in successfully"
            })
            
            // return res.status(200).json({
            //     success: true,
            //     token,
            //     user: userdata,
            //     message: "User logged in successfully"
            // })
        }
        else{
            return res.status(403).json({
                success: false,
                message: 'Incorrect password'
            })
        }
    } catch (err) {
        console.error(err)
        res.status(400).json({
            success: false
        })
    }
}