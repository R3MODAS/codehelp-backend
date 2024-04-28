// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const { auth } = require("../middlewares/auth")
const { updateProfile, deleteAccount, getAllUserDetails, updateDisplayPicture } = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Route for updating user's profile
router.put("/updateProfile", auth, updateProfile)

// Route for delete user account
router.delete("/deleteProfile", auth, deleteAccount)

// Route for getting user details
router.get("/getUserDetails", auth, getAllUserDetails)

// Route for updating display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

// Export the router for use in the main application
module.exports = router