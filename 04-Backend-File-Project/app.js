const express = require("express")
const fileUpload = require("express-fileupload")
const fileRouter = require("./routes/file.routes")
const app = express()

// middlewares
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))
app.use("/api/v1/upload", fileRouter)

module.exports = app