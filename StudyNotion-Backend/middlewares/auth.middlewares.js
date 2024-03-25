const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.models")

// Auth
exports.auth = async (req, res, next) => {
    try {
        // Get the token
        const token = req.body.token || req.cookies.token

        // validate the token
        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        try {
            const decodedPayload = await jwt.verify(token, process.env.JWT_SECRET)
            console.log(decodedPayload)

            // send the decoded value to to the req.user so that other middlewares can access it
            req.user = decodedPayload

        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            })
        }
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong, while verifying the token",
            error: err.message
        })
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student"
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `Student role cannot be verified, please try again`
        })
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for instructor"
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `Instructor role cannot be verified, please try again`
        })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin"
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `Admin role cannot be verified, please try again`
        })
    }
}