const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    accountType: {
        type: String,
        enum: ["Admin", "Instructor", "Student"],
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress"
    }],
    image: {
        type: String,
        required: true,
        trim: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
})

const User = mongoose.model("User", userSchema)
module.exports = User