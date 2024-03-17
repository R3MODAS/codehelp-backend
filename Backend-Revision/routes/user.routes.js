const { Router } = require("express")
const router = Router()
const { login, signup } = require("../controllers/auth.controllers")
const { auth, isStudent, isAdmin } = require("../middlewares/auth.middlewares")

router.post("/signup", signup)
router.post("/login", login)

// Protected Routes
router.get("/test", auth, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "This is protected route for testing auth"
    })
})

router.get("/student", auth, isStudent, (req,res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the protected route for students"
    })
})

router.get("/admin", auth, isAdmin, (req,res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the protected route for admin"
    })
})

module.exports = router