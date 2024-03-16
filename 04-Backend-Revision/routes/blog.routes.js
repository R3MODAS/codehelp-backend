const { Router } = require("express")
const { getAllPosts, createPost, likePost, createComment, deleteComment, unlikePost } = require("../controllers/blog.controllers")
const router = Router()

router.get("/", (req, res) => {
    res.send(`<h1>Welcome to the Backend</h1>`)
})

router.get("/posts", getAllPosts)
router.post("/posts/create", createPost)
router.post("/likes/like", likePost)
router.post("/likes/unlike", unlikePost)
router.post("/comments/create", createComment)
router.post("/comments/uncreate", deleteComment)

module.exports = router