import mongoose from "mongoose"


const postSchema = new mongoose.Schema({
    caption: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    image: {
        public_id: String,
        url: String
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)

export default Post