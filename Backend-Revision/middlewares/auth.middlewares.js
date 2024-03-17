const jwt = require("jsonwebtoken")

exports.auth = async (req,res,next) => {
    try{
        const token = req.body.token || req.cookies.token

        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        try{
            const decodedPayload = jwt.decode(token, process.env.JWT_SECRET);
            req.user = decodedPayload
        }catch(err){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        next()

    }catch(err){
        res.status(400).json({
            success: false,
            message: "You have no authorization to enter this Test Protected route"
        })
    }
}

exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(403).json({
                success: false,
                message: "You are not authorized and permitted to enter this student route"
            })
        }
        next()
    }catch(err){
        res.status(400).json({
            success: false,
            message: "You have no authorization to enter this Student route"
        })
    }
}

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(403).json({
                success: false,
                message: "You are not authorized and permitted to enter this admin route"
            })
        }
        next()
    }catch(err){
        res.status(400).json({
            success: false,
            message: "You have no authorization to enter this Admin route"
        })
    }
}