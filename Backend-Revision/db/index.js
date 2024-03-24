const mongoose = require("mongoose")
const DB_NAME = require("../constants")

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            .then(() => {
                console.log(`MongoDB is connected successfully !!`)
            })
            .catch((err) => {
                console.log(`Error while connecting to MongoDB: `, err)

            })
    } catch (err) {
        console.log(`Something went wrong while connecting to DB: `, err)
        process.exit(1)
    }
}

module.exports = connectDB