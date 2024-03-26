const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    // gender of the user
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"]
    },
    // date of birth of the user
    dateOfBirth: {
        type: String
    },
    // contact number of the user
    contactNumber: {
        type: String,
        trim: true
    },
    // about the user
    about: {
        type: String,
        trim: true
    }
})

const Profile = mongoose.model("Profile", profileSchema)
module.exports = Profile