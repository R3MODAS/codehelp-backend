// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const { SendOtp, Signup, Login, ChangePassword } = require("../controllers/Auth")
const { ResetPasswordToken, ResetPassword } = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", Login)

// Route for user signup
router.post("/signup", Signup)

// Route for sending OTP to the user's email
router.post("/send-otp", SendOtp)

// Route for changing the password
router.post("/change-password", auth, ChangePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating reset password token
router.post("/reset-password-token", ResetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", ResetPassword)

// Export the router for use in the main application
module.exports = router