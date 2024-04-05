const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        enum: ["Student", "Admin", "Instructor"],
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    image: {
        type: String,
        required: true
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ],
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date
})

const User = mongoose.model("User", userSchema)
module.exports = User

// userSchema -> firstName, lastName, email, password, courses, accountType, additionalDetails, image, courseProgress,