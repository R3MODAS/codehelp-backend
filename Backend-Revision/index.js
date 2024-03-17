const app = require("./app");
const connectDB = require("./db");

process.loadEnvFile()

const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})