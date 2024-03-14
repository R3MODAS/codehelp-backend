const { Router } = require("express")
const { createTodo, getAllTodos, getTodo, updateTodo, deleteTodo } = require("../controllers/todo.controllers")
const router = Router()

router.post("/createTodo", createTodo)
router.get("/getTodos", getAllTodos)
router.get("/getTodos/:id", getTodo)
router.put("/updateTodo/:id", updateTodo)
router.delete("/deleteTodo/:id", deleteTodo)

module.exports = router
