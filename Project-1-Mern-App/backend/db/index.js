const mongoose = require("mongoose")

const connectDB = () => {
    mongoose.connect(`${process.env.MONGODB_URL}/Codehelp`)
    .then(() => {
        console.log(`Connected to MongoDB successfully !!!`)
    })
    .catch((err) => {
        console.log("MongoDB connection err",err)
        process.exit(1)
    })
}

module.exports = connectDB