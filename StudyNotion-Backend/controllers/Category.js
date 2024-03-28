const Category = require("../models/Category")

// Create category
exports.createCategory = async (req, res) => {
    try {
        // get the data (name, description) from request body
        const { name, description } = req.body

        // validation of the data
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Please provide every detail for the category"
            });
        }

        // create an entry for category in the db
        const categoryDetails = await Category.create({ name: name, description: description })

        // return the response
        return res.status(201).json({
            success: true,
            message: "Category has been created successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while creating category"
        })
    }
}

// Show all the categories
exports.showAllCategory = async (req, res) => {
    try {
        // find all the categories in the db who has name and description data present
        const allCategories = await Category.find({}, { name: true, description: true })

        // return the response
        return res.status(200).json({
            success: true,
            message: "All Categories are fetched successfully",
            data: allCategories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error while fetching all the Categories"
        });
    }
}
