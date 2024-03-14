const mongoose = require("mongoose")
const { DB_NAME } = require("../constants")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    .then(() => {
        console.log(`MongoDB connected Successfully`)        
    })
    .catch((err) => {
        console.log(`Failed to connect MongoDB`)
        console.log(err)
        process.exit(1)
    })
}

module.exports = connectDB