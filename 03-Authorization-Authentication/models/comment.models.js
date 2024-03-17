const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Comment = mongoose.model("Comment", commentSchema)
module.exports = Comment
