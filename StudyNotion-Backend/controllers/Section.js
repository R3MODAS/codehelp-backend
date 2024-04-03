const Section = require("../models/Section")
const Course = require("../models/Course")

// create a section
exports.createSection = async (req,res) => {
    try{
        // get sectionname and courseId from request body
        const {sectionName, courseId} = req.body

        // validation of data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please fill the data properly"
            })
        }

        // create an entry for section in db
        const newSection = await Section.create({
            sectionName
        })

        // update the section inside the course model
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id: courseId},
            {$push : {courseContent: newSection._id}},
            {new: true})

        // return the response
            

    }catch(err){

    }
}