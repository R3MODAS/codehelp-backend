const express = require("express")
const cookieParser = require('cookie-parser')
const userRouter = require("./routes/user.routes")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/user", userRouter)

module.exports = app