const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")

// Create Rating and Review
exports.createRatingReview = async (req, res) => {
    try {
        // get data (rating, review, course id) from request body
        const { rating, review, courseId } = req.body

        // get user id from req.user (from auth middleware)
        const userId = req.user.id

        // validation of the data
        if (!rating || !review || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the user is enrolled to the course or not
        const enrolledCourse = await Course.findById(
            { _id: courseId },
            {
                studentsEnrolled: { $elemMatch: { $eq: userId } }
            },
            { new: true }
        )
        if (!enrolledCourse) {
            return res.status(400).json({
                success: false,
                message: "You are not enrolled to this course"
            })
        }

        // check if the user already rated the course or not
        const isCourseAlreadyRated = await RatingAndReview.findOne({ user: userId, course: courseId })
        if (!isCourseAlreadyRated) {
            return res.status(400).json({
                success: false,
                message: "You have already rated and reviewed this course"
            })
        }

        // create an rating and review
        const ratingreview = await RatingAndReview.create({
            rating,
            review,
            user: userId,
            course: courseId
        })

        // update the rating and review to the course
        const updatedCourse = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: { ratingAndReviews: ratingreview._id }
            },
            { new: true }
        )

        // return the response
        return res.status(200).json({
            success: false,
            message: "Rating and review given successfully",
            ratingreview
        })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating rating and review",
            error: err.message
        })
    }
}

// Get Average Rating
exports.averageRating = async (req, res) => {
    try {
        // get course id from request body
        const {courseId} = req.body

        // validation of the data
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course id is required"
            })
        }

        // check if the course exists in the db or not
        const course = await Course.findById({_id: courseId})
        if(!course){
            return res.status(400).json({
                success: false,
                message: "Course is not found"
            })
        }

        // calculate the average rating
        const ratingreview = await RatingAndReview.find({course: courseId})
        const totalRating = ratingreview.reduce((acc,curr) => curr.rating + acc, 0)
        const averageRating = totalRating / ratingreview.length

        // return the response
        return res.status(200).json({
            success: true,
            message: "Average rating is fetched successfully",
            averageRating
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting average rating",
            error: err.message
        })
    }
}

// Get All Ratings
exports.getAllRatingReview = async (req,res) => {
    try {
        // find all the rating and reviews
        const allRatingReviews = await RatingAndReview.find({})
        .sort({rating: "desc"})
        .populate({
            path: "user",
            select: "firstName lastName email image"
        })
        .populate({
            path: "course",
            select: "courseName"
        })
        .exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "Got all the ratings and reviews successfully",
            allRatingReviews
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all the ratings",
            error: err.message
        })
    }
}