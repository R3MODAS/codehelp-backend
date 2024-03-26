const CourseModel = require("../models/course.models")
const TagModel = require("../models/tag.models")
const UserModel = require("../models/user.models")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        // fetch data from request body
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body

        // get thumbnail
        const thumbnail = req.files.thumbnailImage

        // validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check for instructor
        const userId = req.user.id
        const instructorDetails = await UserModel.findById(userId)
        console.log("Instructor Details: ", instructorDetails)

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found"
            })
        }

        // check given tag is valid or not
        const tagDetails = await TagModel.findById({ _id: tag })
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag Details not found"
            })
        }

        // Upload Image on cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create an entry for new Course
        const newCourse = await CourseModel.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        // add the new course to the user schema of instructor
        await UserModel.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: { courses: newCourse._id }
            },
            { new: true }
        )

        // return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Failed to create Course",
            error: err.message
        })
    }
}

// getAllCourses handler function
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await CourseModel.find({},
            {
                courseName: true, price: true, thumbnail: true,
                instructor: true, ratingAndReviews: true,
                studentsEnrolled: true
            }).populate("instructor").exec()

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: err.message
        })
    }
}