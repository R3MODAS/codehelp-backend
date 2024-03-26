const mongoose = require("mongoose")

const courseProgressSchema = new mongoose.Schema({
    // course details info is referenced using the course id
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    // current user who is logged in and enrolled
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // every subsection is basically video so will store that subsection id
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }
    ]
})

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)
module.exports = CourseProgress