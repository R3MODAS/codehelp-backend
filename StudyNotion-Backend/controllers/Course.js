const User = require("../models/User")
const Category = require("../models/Category")
const Course = require("../models/Course")

// Create Course
exports.createCourse = async (req,res) => {
    try {
        // get data from the request body
        const {courseName, courseDescription, price, whatYouWillLearn, category} = req.body

        // get the thumbnail from request files
        const thumbnail = req.files.thumbnailImage

        // validation of the data
        if(!courseName || !courseDescription || !price || !whatYouWillLearn || !category || !thumbnail){
            return res.status(500).json({
                success: false,
                message: "All fields are required"
            })
        }

        // get the user id from req.user (from auth middleware)
        const userId = req.user.id

        // check if the user is an instructor or not

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the course",
            error: err.message
        })
    }
}