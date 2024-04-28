const Category = require("../models/Category")
const Course = require("../models/Course")
const User = require("../models/User")

const { cloudinaryUploader } = require("../utils/cloudinaryUploader")

// Create Course
exports.createCourse = async (req, res) => {
    try {
        // get data from request body
        let { courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions } = req.body;

        // get thumbnail from request files
        let thumbnail = req.files.thumbnailImage

        // get user id from req.user (from auth middleware)
        const userId = req.user.id

        // validation of the data
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (!status || status === undefined) {
            status = "Draft"
        }

        // get instructor details
        const instructorDetails = await User.findById({ _id: userId }, { accountType: "Instructor" })
        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: "Instructor is not found"
            })
        }

        // check if the category is valid or not
        const categoryDetails = await Category.findById({ _id: category })
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: "Category is not found"
            })
        }

        // upload the thumbnail to cloudinary
        const thumbnailImage = await cloudinaryUploader(thumbnail, process.env.FOLDER_NAME)

        // create an entry for course in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            price,
            whatYouWillLearn,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status,
            instructions,
            tag
        })

        // update the course in category
        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        )

        // update the course in user
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
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
exports.showAllCourses = async (req, res) => {
    try {
        // find all the courses
        const allCourses = await Course.find({}, { courseName: true, price: true, instructor: true, thumbnail: true }).populate("instructor").exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "Got all the Courses successfully",
            allCourses
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while showing all the courses",
            error: err.message
        })
    }
}

// Get Course Details
exports.getCourseDetails = async (req, res) => {
    try {
        // get data from request body
        const { courseId } = req.body

        // validation of the data
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course id is required"
            })
        }

        // get the course details
        const courseDetails = await Course.findById({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "-videoUrl"
                }
            })
            .exec()

        // validation of the course details
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Course is not found"
            })
        }

        // return the response
        return res.status(200).json({
            success: true,
            message: "Got the course details successfully",
            courseDetails
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the course details"
        })
    }
}