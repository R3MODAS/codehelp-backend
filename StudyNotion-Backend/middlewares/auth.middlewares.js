const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.models")

// Auth
exports.auth = async (req, res, next) => {
    try {
        // extracting token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        // if token missing, then return response

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        // verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = payload
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
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
exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `The Role you provided ${req.user.role} is not matching with the Student Role`
        })
    }
}

// isInstructor
exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructor only"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `The Role you provided ${req.user.role} is not matching with the Instructor Role`
        })
    }
}

// isAdmin
exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `The Role you provided ${req.user.role} is not matching with the Admin Role`
        })
    }
}