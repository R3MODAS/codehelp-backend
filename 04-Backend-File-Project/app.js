const express = require("express")
const fileUpload = require("express-fileupload")
const fileRouter = require("./routes/file.routes")
const app = express()

// middlewares
app.use(express.json())
app.use(fileUpload())
app.use("ap/v1/upload", fileRouter)

module.exports = app