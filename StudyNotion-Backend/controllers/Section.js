const Course = require("../models/Course")
const Section = require("../models/Section")

// create Section
exports.createSection = async (req,res) => {
    try {
        // get data from the request body
        const {sectionName, courseId} = req.body
    } catch (err) {
        console.log(err.message);
        return res.status(200).json({
            success: false,
            message: "Something went wrong while creating section",
            error: err.message
        })
    }
}