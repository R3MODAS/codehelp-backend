const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Auth
exports.auth = async (req,res,next) => {
    try{
        // get the token
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")

        // validation of the token
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token is missing"
            })
        }

        try {
            // decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Failed to decode token"
            })
        }

        next()
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing the user",
            error: err.message
        })
    }
}

// Student
exports.isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: false,
                message: "You are not authorized as student"
            })
        }
        next()
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing as student"
        })
    }
}

// Instructor
exports.isInstructor = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success: false,
                message: "You are not authorized as instructor"
            })
        }
        next()
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing as instructor"
        })
    }
}

// Admin
exports.isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: "You are not authorized as admin"
            })
        }
        next()
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing as admin"
        })
    }
}