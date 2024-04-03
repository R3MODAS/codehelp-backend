const {Router} = require("express")
const { sendOtp } = require("../controllers/Auth")
const router = Router()

router.get("/", (req,res) => {
    res.send(`<h1>Hello, this is Studynotion Backend</h1>`)
})
router.post("/send-otp", sendOtp)

module.exports = router