const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/practice`)
    .then(() => {
        console.log(`MongoDB connected successfully !!`)
    })
    .catch((err) => {
        console.log(`Failed to connect MongoDB: ${err}`)
        process.exit(1)
    })
}

module.exports = connectDB