const Todo = require("../models/todo.models")

const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body
        const response = await Todo.create({ title, description })
        res.status(200).json({
            success: true,
            data: response,
            message: 'Created a Todo successfully !!'
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({})
        res.status(200).json({
            success: true,
            data: todos,
            message: 'Got all the Todos successfully !!'
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

const getTodo = async (req, res) => {
    try {
        const id = req.params.id
        const todo = await Todo.findById({ _id: id })
        if (!todo) {
            res.status(404).json({
                success: false,
                message: "No Data Found with the Given id"
            })
        }
        res.status(200).json({
            success: true,
            data: todo,
            message: `Todo ${id} data is fetched Successfully !!`
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

const updateTodo = async (req, res) => {
    try {
        const id = req.params.id
        const { title, description } = req.body
        const todo = await Todo.findByIdAndUpdate({ _id: id }, { title, description }, {new: true})

        if (!todo) {
            res.status(404).json({
                success: false,
                message: "No Data Found with the Given id"
            })
        }

        res.status(200).json({
            success: true,
            data: todo,
            message: `Todo ${id} data is updated Successfully !!`
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id
        const todo = await Todo.findByIdAndDelete({ _id: id })

        if (!todo) {
            res.status(404).json({
                success: false,
                message: "No Data Found with the Given id"
            })
        }

        res.status(200).json({
            success: true,
            data: todo,
            message: `Todo ${id} data is removed Successfully !!`
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}


module.exports = { createTodo, getAllTodos, getTodo, updateTodo, deleteTodo }