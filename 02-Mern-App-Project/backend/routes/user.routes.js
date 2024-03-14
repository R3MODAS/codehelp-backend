const { Router } = require("express")
const { getAllUsers, createUser } = require("../controllers/user.controllers")
const router = Router()

router.get("/users", getAllUsers)
router.post("/create/user", createUser)

module.exports = router