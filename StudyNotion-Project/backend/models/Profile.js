const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        trim: true
    },
    about: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    }
})

const Profile = mongoose.model("Profile", profileSchema)
module.exports = Profile