const jwt = require("jsonwebtoken")

// auth
exports.auth = async (req, res, next) => {
    try {
        // getting the token
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        // verifying the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)
            
            // sending the decoded value using an user object so that other middlewares can access the value
            req.user = decoded
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorization"
        });
    }
}

// isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "You are not a Student"
            })
        }
        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorizing as Student"
        });
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "You are not an Instructor"
            })
        }
        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorizing as Instructor"
        });
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "You are not an Admin"
            })
        }
        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Authorizing as Admin"
        });
    }
}