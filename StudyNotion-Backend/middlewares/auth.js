const User = require("../models/User")
const jwt = require("jsonwebtoken")

// Auth
exports.auth = async (req, res, next) => {
    try {
        // get the token from request body / cookies / req header
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")

        // validation of the token
        if (!token || token === undefined) {
            return res.status(400).json({
                success: false,
                message: "Token is missing"
            })
        }

        try {
            // decode the payload of jwt
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // pass the decoded value inside the req.user
            req.user = decoded

        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });
        }

        // move to the next handler function
        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorization"
        });
    }
}

// Student
exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: false,
                message: "You are not a Student"
            })
        }
        next()
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorizing as Student"
        });
    }
}

// Instructor
exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success: false,
                message: "You are not an Instructor"
            })
        }
        next()
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorizing as Instructor"
        });
    }
}

// Admin
exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: "You are not an Admin"
            })
        }
        next()
    }catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorizing as Admin"
        });
    }
}