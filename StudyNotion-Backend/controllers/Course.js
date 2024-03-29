const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Create a course
exports.createCourse = async (req, res) => {
    try {
        // get user id
        const userId = req.user.id

        // get the data from request body
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body

        // get the image file
        const thumbnail = req.files.thumbnailImage

        // validation of the data
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category) {
            return res.status(400).json({
                error: "Please fill all the fields"
            });
        }

        // check if the user is instructor or not (optional)
        const instructorDetails = await User.findById({ _id: userId }, { accountType: "Instructor" })
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            });
        }

        // check if the category is valid or not
        const categoryDetails = await Category.findById({ _id: category })
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found"
            });
        }

        // upload image in cloudinary to get the img url
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create a course entry in db using the Course model
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            category: categoryDetails._id,
            whatYouWillLearn,
            price,
            instructor: instructorDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        // update the User Model with new course
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            { $push: { courses: newCourse._id } },
            { new: true })

        // update the Category model with new course
        await Category.findByIdAndUpdate(
            { _id: category },
            { $push: { courses: newCourse._id } },
            { new: true }
        )

        // return the response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            date: newCourse,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            err
        });
    }
}

// Get all the courses
exports.showAllCourses = async (req, res) => {
    try {
        // find all the courses whose courseName, price, thumbnail, instructor and studentsEnrolled are present
        const showAllCourses = await Course.find({},
            {
                courseName: true,
                price: true,
                thumbnail: true,
                instructor: true,
                studentsEnrolled: true
            }).populate("instructor").exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "All courses fetched",
            data: showAllCourses
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get courses"
        });
    }
}