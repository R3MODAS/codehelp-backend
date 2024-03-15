const express = require("express")
const app = express()
const blogRouter = require("./routes/blog.routes")

app.use(express.json())
app.use("/", blogRouter)

module.exports = app