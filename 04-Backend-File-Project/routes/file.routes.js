const { Router } = require("express")
const router = Router()

const { imageUpload, videoUpload, localFileUpload, imageSizeReducer } = require("../controllers/file.controllers")

// api route
router.post("/localFileUpload", localFileUpload)
router.post("/imageUpload", imageUpload)
router.post("/videoUpload", videoUpload)
router.post("/imageSizeReducer", imageSizeReducer)

module.exports = router