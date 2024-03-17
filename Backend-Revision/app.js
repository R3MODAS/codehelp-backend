const express = require("express")
const app = express()
const blogRouter = require("./routes/blog.routes")
const userRouter = require("./routes/user.routes")

app.use(express.json())
app.use("/blog", blogRouter)
app.use("/user", userRouter)

module.exports = app