const { Router } = require("express")
const router = Router()

// Routes for login and signup
const {login,signup} = require("../controllers/auth.controllers")
const { auth, isStudent, isAdmin } = require("../middlewares/auth.middlewares")
router.post("/login", login)
router.post("/signup", signup)

// Protected Routes

router.get("/test", auth, (req,res) => {
    return res.send("<h1>Welcome to the Protected Route for Testing</h1>")
})

router.get("/student", auth, isStudent, (req,res) => {
    return res.send("<h1>Welcome to the Protected Route for Student</h1>")
})

router.get("/admin", auth, isAdmin, (req,res) => {
    return res.send("<h1>Welcome to the Protected Route for Admin</h1>")
})

module.exports = router