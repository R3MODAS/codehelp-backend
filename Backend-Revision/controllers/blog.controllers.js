const PostModel = require("../models/post.models")
const LikeModel = require("../models/like.models")
const CommentModel = require("../models/comment.models")

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({}).populate("comments").populate("likes").exec()
        return res.status(200).json({
            success: true,
            posts,
            message: "Fetched all posts successfully"
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while fetching posts"
        })
    }

}

exports.createPost = async (req, res) => {
    try {
        const { title, body } = req.body
        if (!title || !body) {
            return res.status(400).json({
                success: false,
                message: "Something is wrong with the data"
            })
        }

        const createdPost = await PostModel.create({ title, body })

        return res.status(201).json({
            success: true,
            post: createdPost,
            message: "Post has been created successfully !!!"
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while creating post"
        })
    }
}

exports.likePost = async (req, res) => {
    try {
        const { post, user } = req.body
        if (!post || !user) {
            return res.status(400).json({
                success: false,
                message: "Something is wrong with the data"
            })
        }

        const savedLike = await LikeModel.create({ post, user })

        const updatedPost = await PostModel.findByIdAndUpdate({ _id: post },
            { $push: { likes: savedLike._id } },
            { new: true }).populate("likes").exec()

        return res.status(200).json({
            success: true,
            post: updatedPost,
            message: "Post has been updated with the like successfully !!!"
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while liking the post"
        })
    }

}

exports.unlikePost = async(req,res) => {
    try {
        const { post, like } = req.body

        const deletedLike = await LikeModel.findByIdAndDelete({_id: like})

        const updatedPost = await PostModel.findByIdAndUpdate({ _id: post },
            { $pull: { likes: deletedLike._id } },
            { new: true })

        return res.status(200).json({
            success: true,
            post: updatedPost,
            message: "Unliked the post successfully !!!"
        })

    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while unliking the post"
        })
    }
}

exports.createComment = async (req, res) => {
    try {
        const { post, body, user } = req.body
        if (!post || !body || !user) {
            return res.status(400).json({
                success: false,
                message: "Something is wrong with the data"
            })
        }

        const savedComment = await CommentModel.create({ post, body, user })

        const updatedPost = await PostModel.findByIdAndUpdate({ _id: post },
            { $push: { comments: savedComment._id } },
            { new: true }).populate("comments").exec()

        return res.status(200).json({
            success: true,
            post: updatedPost,
            message: "Post has been updated with the comment successfully !!!"
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while creating the comment"
        })
    }
}

exports.deleteComment = async (req,res) => {
    try {
        const { post, comment } = req.body

        const deletedComment = await CommentModel.findByIdAndDelete({_id: comment})

        const updatedPost = await PostModel.findByIdAndUpdate({ _id: post },
            { $pull: { comments: deletedComment._id } },
            { new: true })

        return res.status(200).json({
            success: true,
            post: updatedPost,
            message: "Comment has been deleted successfully !!!"
        })
    } catch (err) {
        console.error(err)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while deleting the comment"
        })
    }
}