const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    gender: {
        type: String
    },
    about: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: String
    },
    contactNumber: {
        type: String,
        trim: true
    }
})

const Profile = mongoose.model("Profile", profileSchema)
module.exports = Profile