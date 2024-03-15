const { Router } = require("express")
const router = Router()

const { login, signup } = require("../controllers/auth.controllers")
const { auth, isStudent, isAdmin } = require("../middlewares/auth.middlewares")

router.post("/signup", signup)
router.post("/login", login)

// testing protected route for single middleware
router.get("/test", auth, (req,res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for testing"
    })
})

// Protected Route
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for students"
    })
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for Admin"
    })
})

module.exports = router