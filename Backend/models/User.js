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
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    image: {
        type: String,
        required: true
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ],
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User