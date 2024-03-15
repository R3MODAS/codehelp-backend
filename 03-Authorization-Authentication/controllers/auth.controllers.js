const UserModel = require("../models/user.models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    try {
        // get the data
        const { name, email, password, role } = req.body
        // check if user already exist
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already Exists"
            })
        }

        // secure the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing the password"
            })
        }

        // create entry for User
        const user = await UserModel.create({ name, email, password: hashedPassword, role })

        return res.status(200).json({
            success: true,
            data: user,
            message: "User has been created successfully !!"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later"
        })
    }
}

exports.login = async (req, res) => {
    try {
        // data fetch
        const { email, password } = req.body

        // validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details carefully'
            })
        }

        // check for registered user
        const user = await UserModel.findOne({ email })

        // if not a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered'
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        // verify password and generate JWT token
        if (await bcrypt.compare(password, user.password)) {
            // password match
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            // user.token = token
            // user.password = undefined

            const cookieData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            }

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            // cookie
            res.cookie("remoCookie", token, options).status(200).json({
                success: true,
                token,
                user: cookieData,
                message: "User logged in successfully"
            })

        }
        else {
            // password do not match
            return res.status(403).json({
                success: false,
                message: 'Incorrect password'
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}
