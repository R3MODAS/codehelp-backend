const { Router } = require("express")
const { sendOtp, Login, Signup, changePassword } = require("../controllers/Auth")
const { auth } = require("../middlewares/auth")
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword")

const router = Router()

router.post("/send-otp", sendOtp)
router.post("/signup", Signup)
router.post("/login", Login)
router.post("/changepassword", auth, changePassword)

// Reset Password
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

module.exports = router