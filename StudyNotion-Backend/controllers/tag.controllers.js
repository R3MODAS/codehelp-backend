const TagModel = require("../models/tag.models")

// createTag handler function
exports.createTag = async (req, res) => {
    try {
        // fetch data from request body
        const { name, description } = req.body

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // create tag entry in db
        const tagDetails = await TagModel.create({ name, description })
        console.log(tagDetails)

        // return response
        return res.status(200).json({
            success: true,
            message: "Tag created successfully"
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// getAllTags handler function
exports.getAllTags = async (req, res) => {
    try {
        const allTags = await TagModel.find({}, { name: true, description: true })
        return res.status(200).json({
            success: true,
            message: "All tags returned successfully",
            allTags
        })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}