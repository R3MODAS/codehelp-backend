const express = require("express")
const cookieParser = require('cookie-parser')
const blogRouter = require("./routes/blog.routes")
const userRouter = require("./routes/user.routes")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/blog", blogRouter)
app.use("/user", userRouter)

module.exports = app