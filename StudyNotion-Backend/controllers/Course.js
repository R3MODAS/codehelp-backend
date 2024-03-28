const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Create a course
exports.createCourse = async (req, res) => {
    // get user id
    // get the data from request body
    // get the image file
    // validation of the data
    // check if the user is instructor or not
    // check if the category is valid or not
    // upload image in cloudinary to get the img url
    // create a course entry in db using the Course model
    // update the User Model with new course 
    // update the Category model with new course
    // return the response
}

// Get all the courses
exports.showAllCourses = async (req, res) => {

}