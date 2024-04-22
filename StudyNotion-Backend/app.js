const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const UserRouter = require("./routes/User")

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

// Routes
app.use("/", UserRouter)

module.exports = app