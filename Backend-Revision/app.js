const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

const router = require("./routes/routes")

app.use("/", router)

module.exports = app