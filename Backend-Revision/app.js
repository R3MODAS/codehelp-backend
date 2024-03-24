const express = require("express")
const userRouter = require("./routes/user.routes")

const app = express()
app.use(express.json())

// Routes
app.use("/api/v1/user", userRouter)

module.exports = app