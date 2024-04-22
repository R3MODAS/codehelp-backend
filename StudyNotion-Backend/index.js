const app = require("./app");
const cloudinary = require("cloudinary").v2
const connectDB = require("./db/index")
process.loadEnvFile()

const PORT = process.env.PORT || 5000

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

connectDB()
    .then(() => {

        app.on("error", (err) => {
            console.log(`Error: `, err.message);
            throw new Error(err.message)
        })

        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        })
    })
    .catch((err) => {
        console.log(`MongoDB connection failed: `, err.message);
    })
