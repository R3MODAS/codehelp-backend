// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const { capturePayment, verifySignature } = require("../controllers/Payment")
const { auth, isStudent } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Payment routes
// ********************************************************************************************************

// Route for capturing payment
router.post("/capturePayment", auth, isStudent, capturePayment)

// Route for verifying signature
router.post("/verifySignature", verifySignature)

// Export the router for use in the main application
module.exports = router