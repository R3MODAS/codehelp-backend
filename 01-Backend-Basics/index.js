const app = require("./app");
const connectDB = require("./db");

// Loads the env file
process.loadEnvFile()

connectDB()
app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`)
})

// default Route
app.get("/", (req,res) => {
    res.send(`<h1>This is the Homepage !!!</h1>`)
})
