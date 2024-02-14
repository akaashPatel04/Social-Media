import Post from "../models/Post.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
import getDataUri from "../middlewares/dataUri.js"


//POST || Create Post
export const CreatePost = async (req, res) => {
    try {

        const image = getDataUri(req.file)

        let myCloud = await cloudinary.uploader.upload(image.content,
            { folder: "posts" })

        const post = await Post.create({
            caption: req.body.caption,
            user: req.user._id,
            image: {
                url: myCloud?.secure_url,
                public_id: myCloud?.public_id
            }
        })

        const user = await User.findById(req.user._id)
        user.posts.push(post)
        await user.save()

        return res.status(201).send({
            message: "Post Created",
            post
        })

    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

//DELETE || Delete Post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).send({
                message: "Post not Found",
            })
        }

        if (req.user._id.toString() !== post.user.toString()) {
            return res.status(401).send({
                message: "Unauthorized",
            })
        }

        await cloudinary.uploader.destroy(post.image.public_id, { folder: "posts" })
        const deletedPost = await Post.findByIdAndDelete(post._id)

        await User.findByIdAndUpdate(
            deletedPost.user,
            { $pull: { posts: deletedPost._id } },
            { new: true }
        )

        return res.status(201).send({
            message: "Post Deleted"
        })
    } catch (error) {
        return res.status(500).send({
            message: error.message
        })
    }
}

//GET || Get Single  Posts
export const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).send({
                message: "Post not Found"
            })
        }

        return res.status(200).send({
            post
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        })
    }
}

//GET || Get Followed User's Posts
export const getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const posts = await Post.find({
            user: {
                $in: user.following
            }
        }).populate({
            path: 'user',
            select: 'username avatar'
        }).populate({
            path: 'likes',
            select: '-email -password'
        }).populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: 'username avatar'
            }
        });


        return res.status(200).send({
            posts: posts.reverse()
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        })
    }
}

//POST || Like and Dislike
export const likeDislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            })
        }

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id)

            post.likes.splice(index, 1)

            await post.save()

            return res.status(200).send({
                message: "Post Disliked",
            })
        } else {
            post.likes.push(req.user._id)

            await post.save()

            return res.status(200).send({
                message: "Post Liked",
            })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        })
    }
};


//PUT || Update Post Caption
export const updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(req.body.caption);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { caption: req.body.caption }, { new: true });

        res.status(200).json({
            message: "Post updated",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//PUT || Add Comment
export const commentOnPost = async (req, res) => {

    if (!req.body.comment) {
        return res.status(404).json({
            message: "Please add a Comment",
        });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        let commentIndex = -1;

        // Checking if comment already exists
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                commentIndex = index;
            }
        });

        if (commentIndex !== -1) {
            post.comments[commentIndex].comment = req.body.comment;

            await post.save();

            return res.status(200).json({
                message: "Comment Updated",
            });
        } else {
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment,
            });

            await post.save();
            return res.status(200).json({
                message: "Comment Added",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//DELETE || Remove Comment
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
            });
        }

        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                return post.comments.splice(index, 1);
            }
        });

        await post.save();

        return res.status(200).json({
            message: "Comment Deleted",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
