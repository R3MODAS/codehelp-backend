const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`)
        .then(() => {
            console.log(`MongoDB is connected successfully`);
        })
        .catch((err) => {
            console.log("MongoDB connection Failed: ", err.message);
            process.exit(1)
        })
}

module.exports = connectDB