const Category = require("../models/Category")

// Create Category
exports.createCategory = async (req,res) => {
    try {
        // get name and description from request body
        const {name, description} = req.body

        // validation of the data
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Name/Description is required"
            })
        }

        // create the category
        const category = await Category.create({ name, description})

        // return the response
        return res.status(200).json({
            success: true,
            message: "Category is created successfully",
            category
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the category",
            error: err.message
        })
    }
}

// Show all Categories
exports.showAllCategories = async (req,res) => {
    try{
        // find all the categories
        const allCategories = await Category.find({}, {name: true, description: true})

        // return the response
        return res.status(200).json({
            success: true,
            message: "Got all the Categories successfully",
            allCategories
        })
    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all the categories",
            error: err.message
        })
    }
}

// Category Page Details
exports.CategoryPageDetails = async (req,res) => {
    try{
        // get categoryId from request body
        const {categoryId} = req.body

        // validation of the data
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Course id is required"
            })
        }

        // get courses (for specified categoryId)
        const selectedCategory = await Category.findById({_id: categoryId})
            .populate("courses")
            .exec()

        // check if the category exists in the db or not
        if(!selectedCategory){
            return res.status(400).json({
                success: false,
                message: "Category not found"
            })
        }

        // check if there are courses in the category or not
        if(selectedCategory.courses.length === 0){
            return res.status(400).json({
                success: false,
                message: "No courses are found"
            })
        }

        // get courses for different categories
        const differentCategory = await Category.find({
            _id: {$ne: categoryId}
        })
        .populate("courses")
        .exec()

        // get top selling courses
        
        // return the response
        return res.status(200).json({
            success: true,
            message: "Got Category page details successfully",
            selectedCategory,
            differentCategory
        })

    }catch(err){
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the category page details",
            error: err.message
        })
    }
}