          // Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const { createCourse, getCourseDetails, showAllCourses } = require("../controllers/Course")

// Categories Controllers Import
const { createCategory, showAllCategories, CategoryPageDetails } = require("../controllers/Category")

// Sections Controllers Import
const { createSection, updateSection, deleteSection } = require("../controllers/Section")

// Sub-Sections Controllers Import
const { createSubSection, updateSubSection, deleteSubSection } = require("../controllers/Subsection")

// Rating Controllers Import
const { createRatingReview, averageRating, getAllRatingReview } = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.put("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection)

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Edit Sub Section
router.put("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection)

// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", CategoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingReview)
router.get("/getAverageRating", averageRating)
router.get("/getReviews", getAllRatingReview)

// Export the router for use in the main application
module.exports = router