const { Router } = require("express")
const router = Router()

const { login, signup } = require("../controllers/auth.controllers")

router.post("/signup", signup)
router.post("/login", login)

module.exports = router