const {Router} = require("express")
const router = Router()

const {imageUpload, videoUpload, imageReducerUpload, localFileUpload} = require("../controllers/file.controllers")

// api route
router.post("/localFileUpload", localFileUpload)
router.post("/imageUpload", imageUpload)

module.exports = router