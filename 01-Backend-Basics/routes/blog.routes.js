const { Router } = require("express")
const { createComment, createPost, getAllPosts, likePost, unlikePost, deleteComment } = require("../controllers/blog.controllers")
const router = Router()

router.get("/posts", getAllPosts)
router.post("/posts/createPost", createPost)
router.post("/comments/create", createComment)
router.delete("/comments/delete", deleteComment)
router.post("/likes/like", likePost)
router.delete("/likes/unlike", unlikePost)

module.exports = router
