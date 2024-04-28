const app = require("./app");
const cloudinary = require("cloudinary").v2
const connectDB = require("./db/index")
process.loadEnvFile()

const PORT = process.env.PORT || 8000

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

connectDB()
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})


