const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const {cloudinaryUploader} = require("../utils/cloudinaryUploader")

// Create SubSection
exports.createSubSection = async (req,res) => {
    try {
        // get data from request body
        const {title, description, sectionId } = req.body

        // get video from request files
        const video = req.files.videoFile

        // validation of the data
        if(!title || !description || !sectionId || !video){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the section exists in the db or not
        const section = await Section.findById({_id: sectionId})
        if(!section){
            return res.status(400).json({
                success: false,
                message: "Section is not found"
            })
        }

        // upload the video to cloudinary
        const videoResponse = await cloudinaryUploader(video, process.env.FOLDER_NAME)

        // create an entry for subsection in db
        const subsection = await SubSection.create({
            title,
            description,
            videoUrl: videoResponse.secure_url,
            timeDuration: `${videoResponse.duration}`
        })

        // update the subsection in section
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push: {subSection: subsection._id}
            },
            {new: true}
        ).populate("subSection").exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "Subsection is created successfully",
            updatedSection
        })

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            success: false,
            message: "Something went wrong while creating the subsection",
            error: err.message
        })
    }
}

// Update SubSection
exports.updatedSubSection = async (req,res) => {
    try {
        // get data from request body
        const {title, description, subSectionId, sectionId} = req.body

        // check if the subsection exists in the db or not
        const subSection = await SubSection.findById({_id: subSectionId})
        if(!subSection){
            return res.status(400).json({
                success: false,
                message: "SubSection is not found"
            })
        }

        // validation data and update the data accordingly
        if(title !== undefined){
            subSection.title = title
        }

        if(description !== undefined){
            subSection.description = description
        }

        if(req.files && req.files.videoFile !== undefined){
            const video = req.files.videoFile
            const videoResponse = await cloudinaryUploader(video, process.env.FOLDER_NAME)

            subSection.videoUrl = videoResponse.secure_url
            subSection.timeDuration = `${videoResponse.duration}`
        }

        // save the changes
        await subSection.save()

        // show the updated section
        const updatedSection = await Section.findById({_id: sectionId})
        .populate("subSection").exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "SubSection is updated successfully",
            updatedSection
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the subsection",
            error: err.message
        })
    }
}

// Delete SubSection
exports.deleteSubSection = async (req,res) => {
    try {
        // get data from request body
        const {subSectionId, sectionId} = req.body

        // validation of the data
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the subsection exists in the db or not
        const subsection = await SubSection.findById({_id: subSectionId})
        if(!subsection){
            return res.status(400).json({
                success: false,
                message: "SubSection is not found"
            })
        }

        // delete the subsection
        await SubSection.findByIdAndDelete({_id: subSectionId})

        // delete the subsection from section
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull: {subSection: subSectionId}
            },
            {new: true}
        )

        // show the updated section
        const updatedSection = await Section.findById({_id: sectionId})
        .populate("subSection").exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "SubSection is deleted successfully",
            updatedSection
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the subsection",
            error: err.message
        })
    }
}