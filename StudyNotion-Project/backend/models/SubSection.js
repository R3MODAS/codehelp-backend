const mongoose = require("mongoose")

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    timeDuration: {
        type: String
    },
    videoUrl: {
        type: String
    }
})

const SubSection = mongoose.model("SubSection", subSectionSchema)
module.exports = SubSection