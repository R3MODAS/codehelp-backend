const User = require('../models/User')

exports.createUser = async (req, res) => {
    try {
        const { name, email, title, department, role } = req.body
        if (!name || !email || !title || !role || !department) {
            return res.status(400).json({
                status: 400,
                message: "Please fill all fields",
            });
        }
        const createdUser = await User.create({
            name,
            email,
            title,
            department,
            role,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        });
        res.status(200).json({
            status: 201,
            message: "User created successfully",
            data: createdUser,
        });

    } catch (err) {

    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            success: true,
            data: users,
            message: "Users fetched successfully !!"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}