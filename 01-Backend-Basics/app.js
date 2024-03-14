const express = require("express")
const todoRouter = require("./routes/todo.routes")
const blogRouter = require("./routes/blog.routes")
const app = express()

app.use(express.json())
app.use("/api/v1", todoRouter)
app.use("/", blogRouter)

module.exports = app