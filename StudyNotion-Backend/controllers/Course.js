const User = require("../models/User")
const Category = require("../models/Category")
const Course = require("../models/Course")
const { cloudinaryUploader } = require("../utils/cloudinaryUploader")

// Create Course
exports.createCourse = async (req, res) => {
    try {
        // get data from request body
        const { courseName, courseDescription, price, whatYouWillLearn, category } = req.body

        // get the thumbnail from request files
        const thumbnail = req.files.thumbnailImage

        // validation of the data
        if (!courseName || !courseDescription || !price || !whatYouWillLearn || !category || !thumbnail) {
            return res.status(500).json({
                success: false,
                message: "All fields are required"
            })
        }

        // get the user id from req.user (from auth middleware)
        const userId = req.user.id

        // check if the user is an instructor or not
        const instructorDetails = await User.findById(userId, { accountType: "Instructor" })
        if (!instructorDetails) {
            return res.status(500).json({
                success: false,
                message: "No Instructor is found"
            })
        }

        // check if the category exists in the db or not
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(500).json({
                success: false,
                message: "No Category is found"
            })
        }

        // upload the thumbnail img in cloudinary
        const thumbnailImage = await cloudinaryUploader(thumbnail, process.env.FOLDER_NAME)

        // create an entry for course in db
        const newCourse = await Course.create(
            {
                courseName,
                courseDescription,
                instructor: instructorDetails._id,
                price,
                whatYouWillLearn,
                thumbnail: thumbnailImage.secure_url,
                category: categoryDetails._id
            }
        )

        // update the course details for user in db
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
               $push: {courses: newCourse._id}
            },
            {new: true}
        )

        // update the course details for category in db
        await Category.findByIdAndUpdate(
            {_id: categoryDetails._id},
            {
                $push: {courses: newCourse._id}
            },
            {new: true}
        )

        // return the response
        return res.status(200).json({
            success: true,
            message: "Course is created successfully",
            newCourse
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the course",
            error: err.message
        })
    }
}

// Show all Courses
exports.showAllCourses = async (req,res) => {
    try {
        // find all the courses
        const allCourses = await Course.find({}, {courseName: true, price: true, instructor: true, thumbnail: true}).populate("instructor").exec()

        // return the response
        return res.status(200).json({
            success:true,
            message: "All courses fetched",
            allCourses
          });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all the courses",
            error: err.message
        })
    }
}