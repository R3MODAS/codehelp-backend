const app = require("./app")
const connectDB = require("./db/index")

process.loadEnvFile()

connectDB()

app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`)
})