const Section = require("../models/Section")
const SubSection = require("../models/SubSection")

const { cloudinaryUploader } = require("../utils/cloudinaryUploader")

// Create Section
exports.createSubSection = async (req, res) => {
    try {
        // get data from request body
        const { title, description, sectionId } = req.body

        // get video from request files
        const video = req.files.videoFile

        // validation of the data
        if (!title || !description || !sectionId || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the section exists in the db or not
        const section = await Section.findById({ _id: sectionId })
        if (!section) {
            return res.status(400).json({
                success: false,
                message: "Section is not found"
            })
        }

        // upload the video to cloudinary
        const videoDetails = await cloudinaryUploader(video, process.env.FOLDER_NAME)

        // create an entry for subsection in db
        const newSubSection = await SubSection.create(
            {
                title,
                description,
                videoUrl: videoDetails.secure_url,
                timeDuration: `${videoDetails.duration}`
            })

        // update the subsection in section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $push: { subSection: newSubSection._id }
            },
            { new: true }
        )
            .populate("subSection").exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "Subsection is created successfully",
            updatedSection
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the subsection",
            error: err.message
        })
    }
}

// Update Section
exports.updateSubSection = async (req, res) => {
    try {
        // get data from request body
        const { title, description, subsectionId, sectionId } = req.body

        // check if the subsection exists in the db or not
        const subSection = await SubSection.findById({ _id: subsectionId })
        if (!subSection) {
            return res.status(400).json({
                success: false,
                message: "SubSection is not found"
            })
        }

        // validate data and update it accordingly
        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }

        if (req.files && req.files.videoFile !== undefined) {
            const video = req.files.videoFile
            const videoDetails = await cloudinaryUploader(video, process.env.FOLDER_NAME)

            subSection.videoUrl = videoDetails.secure_url
            subSection.timeDuration = `${videoDetails.duration}`
        }

        // update the data for subsection in db
        await subSection.save()

        // show the updated section
        const updatedSection = await Section.findById({ _id: sectionId }).populate("subSection").exec()

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

// Delete Section
exports.deleteSubSection = async (req, res) => {
    try {
        // get data from request body
        const { subsectionId, sectionId } = req.body

        // validation of the data
        if (!subsectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check if the subsection exists in the db or not
        const subSection = await SubSection.findById({ _id: subsectionId })
        if (!subSection) {
            return res.status(400).json({
                success: false,
                message: "SubSection is not found"
            })
        }

        // delete the subsection from section
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: { subSection: subsectionId }
            },
            { new: true }
        )

        // delete the subsection
        await SubSection.findByIdAndDelete({ _id: subsectionId })

        // show the updated section
        const updatedSection = await Section.findById({ _id: sectionId }).populate("subSection").exec()

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