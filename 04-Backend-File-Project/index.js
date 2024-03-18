const app = require("./app");
const connectDB = require("./db");
const cloudinary = require("./utils/cloudinary")

process.loadEnvFile()

const PORT = process.env.PORT || 5000

connectDB()
cloudinary.cloudinaryConnect()

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})