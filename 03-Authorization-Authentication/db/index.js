const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/CodehelpBackend`)
    .then(() => {
        console.log(`MongoDB connection successful !!`)
    })
    .catch((err) => {
        console.log(`Failed to connect MongoDB :`,err)
        process.exit(1)
    })
}

module.exports = connectDB