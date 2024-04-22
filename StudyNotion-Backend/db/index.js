const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/StudyNotion`)
        console.log(`MongoDB is connected successfully : ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log("MongoDB connection Failed: ", err.message);
        process.exit(1)
    }
}

module.exports = connectDB