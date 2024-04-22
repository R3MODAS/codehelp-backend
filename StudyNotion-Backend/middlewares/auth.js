const jwt = require("jsonwebtoken")

// Auth
exports.auth = async (req,res,next) => {
    try{
        // get the token
        const token = req.cookies.token

        // validation of the token
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Token is required"
            })
        }

        try{
            // decode the payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // send the value to req.user
            req.user = decoded
        }catch(err){
            return res.status(400).json({
                success: false,
                message: "Failed to decode the payload"
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
    try{
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: false,
                message: "Failed to Authorize as Student"
            })
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing as a student",
            error: err.message
        })
    }
}

// Admin
exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                message: "Failed to Authorize as Admin"
            })
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing as admin",
            error: err.message
        })
    }
}

// Instructor
exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success: false,
                message: "Failed to Authorize as Instructor"
            })
        }
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authorizing as instructor",
            error: err.message
        })
    }
}