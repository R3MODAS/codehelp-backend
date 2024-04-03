const jwt = require("jsonwebtoken")

// auth
exports.auth = async (req, res, next) => {
    try {
        // get the token
        const token = req.cookies.token || req.body.token

        // validation of the token
        if (!token || token === undefined) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            })
        }

        try {
            // decoding the payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = decoded
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Failed to decode the token"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "You have failed to authorize",
            error: err.message
        })
    }
}

// student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(400).json({
                success: false,
                message: "You have failed to authorize as student"
            })
        }
        next()
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Error while authorizing as student"
        })
    }
}

// instructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(400).json({
                success: false,
                message: "You have failed to authorize as instructor"
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Error while authorizing as instructor"
        })
    }
}

// admin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(400).json({
                success: false,
                message: "You have failed to authorize as admin"
            })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Error while authorizing as admin"
        })
    }
}