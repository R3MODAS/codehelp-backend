const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const fileUpload = require("express-fileupload")

// Import the Defined Routes
const userRoutes = require("./routes/User")
const profileRoutes = require("./routes/Profile")
const contactRoutes = require("./routes/Contact")
const paymentRoutes = require("./routes/Payment")
const courseRoutes = require("./routes/Course")

const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}))

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/contact", contactRoutes);

// Default Route
app.get("/", (req,res) => {
    return res.status(200).json({
        success: true,
        message: "Welcome to the StudyNotion Backend"
    })
})

module.exports = app