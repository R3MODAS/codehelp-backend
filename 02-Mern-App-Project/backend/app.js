const express = require("express")
const cors = require("cors")
const app = express()


const userRouter = require('./routes/user.routes')

app.use(cors())
app.use(express.json())
app.use("/api/v1", userRouter)

module.exports = app