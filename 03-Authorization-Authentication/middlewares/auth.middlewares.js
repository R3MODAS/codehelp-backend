// auth, isStudent, isAdmin
const jwt = require("jsonwebtoken")

exports.auth = (req, res, next) => {
    try {
        // extract jwt token
        // PENDING : other ways to fetch token
        const token = req.body.token

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        // verify the jwt
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            console.log(payload)
            req.user = payload
        }catch(err){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong, while verifying the token"
        })
    }
}

exports.isStudent = (req, res, next) => {
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
            message: "The Role is not matching"
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admin"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "The Role is not matching"
        })
    }
}