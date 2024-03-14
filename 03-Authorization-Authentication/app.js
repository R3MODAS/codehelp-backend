const express = require("express")
const app = express()

app.use(express.json())

const userRouter = require("./routes/user.routes")
app.use("/api/v1", userRouter)

module.exports = app