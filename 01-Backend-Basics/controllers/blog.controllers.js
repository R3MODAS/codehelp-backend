const Post = require("../models/post.models")
const Comment = require("../models/comment.models")
const Like = require("../models/like.models")

exports.getAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find({}).populate("likes").populate("comments").exec()
        res.status(200).json({
            success: true,
            data: allPosts,
            message: "Fetched all the Posts successfully !!"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

exports.createPost = async (req, res) => {
    try {
        const { title, body } = req.body
        const createdPost = await Post.create({ title, body })
        res.status(200).json({
            success: true,
            data: createdPost,
            message: "Created the post successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

exports.createComment = async (req, res) => {
    try {
        const { post, user, body } = req.body

        const findPost = await Post.findById({_id : post})

        if(!findPost){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        const comment = new Comment({ post, user, body })

        const savedComment = await comment.save()

        const updatedPost = await Post.findByIdAndUpdate({ _id: post },
            { $push: { comments: savedComment._id } },
            { new: true }).populate("comments").exec()
        res.status(200).json({
            success: true,
            data: updatedPost,
            message: "Created comment successfully !!"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const { post, comment } = req.body

        const findPost = await Post.findById({_id : post})

        if(!findPost){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        const deletedComment = await Comment.findOneAndDelete({ post: post, _id: comment })

        const updatedPost = await Post.findByIdAndUpdate({ _id: post },
            { $pull: { comments: deletedComment._id } },
            { new: true })

        res.status(200).json({
            success: true,
            data: updatedPost,
            message: "Deleted the comment successfully !!"
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

exports.likePost = async (req, res) => {
    try {
        const { post, user } = req.body

        const findPost = await Post.findById({_id : post})

        if(!findPost){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        const like = new Like({ post, user })
        const savedLike = await like.save()

        const updatedPost = await Post.findByIdAndUpdate({ _id: post },
            { $push: { likes: savedLike._id } },
            { new: true }).populate("likes").exec()

        res.status(200).json({
            success: true,
            data: updatedPost,
            message: "Liked the post successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}

exports.unlikePost = async (req, res) => {
    try {
        const { post, like } = req.body

        const findPost = await Post.findById({_id : post})

        if(!findPost){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        // const deletedLike = await Like.findOneAndDelete({ post: post, _id: like })
        const deletedLike = await Like.findByIdAndDelete({_id : like})

        const updatedPost = await Post.findByIdAndUpdate({ _id: post },
            { $pull: { likes: deletedLike._id } },
            { new: true })
        res.status(200).json({
            success: true,
            data: updatedPost,
            message: "Unliked the post successfully !!"
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            data: "Internal Server Error",
            message: err.message
        })
    }
}