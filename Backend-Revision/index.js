const app = require("./app");
const connectDB = require("./db");

process.loadEnvFile()

connectDB()

app.listen(process.env.PORT, () => {
    console.log(`Server connected at http://localhost:${process.env.PORT}`)
})