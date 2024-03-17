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
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }

        let hashedpassword;
        try {
            hashedpassword = await bcrypt.hash(password, 10)
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong while hashing the password"
            })
        }

        const user = await UserModel.create({ name, email, password: hashedpassword, role })
        return res.status(201).json({
            success: true,
            user,
            message: "Congrats! you have successfully created your user"
        })

    } catch (err) {
        res.status(400).json({
            success: "false",
            error: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Something is wrong with your data"
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({
                id: user._id,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET, {expiresIn: "3d"})

            res.cookie("token", token, {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }).status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    token: token
                },
                message: "Logged in successfully"
            })
        }
        else{
            return res.status(403).json({
                success: false,
                message: "Incorrect password"
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        })
    }
}

