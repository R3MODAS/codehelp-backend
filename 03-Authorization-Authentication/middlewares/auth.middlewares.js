const jwt = require("jsonwebtoken")

exports.auth = async (req,res,next) => {
    try{
        console.log("Cookie", req.cookies.token)
        console.log("Body", req.body.token)
        console.log("Header", req.header("Authorization"))

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")

        if(!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }
        
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            req.user = payload
        }catch(err){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        next()
    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Something went wrong, while verifying the token",
            error: err.message
        })
    }

}

exports.isStudent = async (req,res,next) => {
    try {
        if(req.user.role !== "Student"){
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
            message: `The Role you provided ${req.user.role} is not matching with the Admin Role`
        })
    }
}

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin"
            })
        }
        next()
    }catch(err){
        console.error(err)
        return res.status(500).json({
            success: false,
            message: `The Role you provided ${req.user.role} is not matching with the Admin Role`
        })
    }
}