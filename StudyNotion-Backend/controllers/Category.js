const Category = require("../models/Category")

// Create Category
exports.createCategory = async (req,res) => {
    try {
        // get data from request body
        const {name, description} = req.body

        // validation of the data
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // create an entry for category in db
        const createdCategory = await Category.create({name, description})

        // return the response
        return res.status(200).json({
            success: true,
            message: "Category is created successfully",
            createdCategory
        })


    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating category",
            error: err.message
        })
    }
}

// Show all Categories
exports.showAllCategories = async (req,res) => {
    try {
        // find all the categories
        const allCategories = await Category.find({}, {name: true, description: true})

        // return the response
        return res.status(200).json({
            success: true,
            message: "All Categories is fetched successfully",
            allCategories
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while showing all the categories",
            error: err.message
        })
    }
}