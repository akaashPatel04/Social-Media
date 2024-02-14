import User from "../models/User.js"
import Post from "../models/Post.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import getDataUri from "../middlewares/dataUri.js"


//Register || POST || Public
export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).send({
                message: "Please fill out all Fields"
            })
        }

        //Verifying User Exists

        const userNameVerify = await User.findOne({ username })
        if (userNameVerify) {
            return res.status(400).send({
                message: "This username is already taken"
            })
        }

        const emailVerify = await User.findOne({ email })
        if (emailVerify) {
            return res.status(400).send({
                message: "Email already used, Please try different one"
            })
        }

        const createdUser = await User.create({
            username,
            email,
            password
        })

        const token = await generateToken(createdUser._id)

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        return res.status(201).cookie("token", token, options).json({
            message: "Account Created",
            user: createdUser
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        })
    }

}


//Logout || GET || Private
export const Logout = async (req, res) => {
    try {
        const options = {
            expires: new Date(Date.now()),
            httpOnly: true
        }

        return res.status(200).cookie("token", null, options).json({
            message: "Logged Out",
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        })
    }
}

//Login || POST || Public
export const Login = async (req, res) => {
    try {

        const { username, password } = req.body

        if (!username || !password) {
            return res.status(401).send({
                message: "Please fill out all Fields"
            })
        }

        const user = await User.findOne({ username })

        //Verifying User Exists
        if (!user) {
            return res.status(400).send({
                message: "Invalid Username or Password"
            })
        }

        //Verifying Password
        const isPasswordTrue = await bcrypt.compare(password, user.password)

        if (!isPasswordTrue) {
            return res.status(400).send({
                message: "Wrong Password"
            })
        }

        const token = await generateToken(user._id)

        const options = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        return res.status(200).cookie("token", token, options).json({
            message: "Logged In",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        })
    }
}


//Follow || GET || Public
export const Follow = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user.id)
        const userToFollow = await User.findById(req.params.id)


        if (!userToFollow) {
            return res.status(400).send({
                message: "User not Found"
            })
        }

        if (loggedInUser.following.includes(userToFollow._id)) {

            const followingIndex = loggedInUser.following.indexOf(userToFollow._id)
            const followersIndex = userToFollow.followers.indexOf(loggedInUser._id)

            loggedInUser.following.splice(followingIndex, 1)
            userToFollow.followers.splice(followersIndex, 1)

            await loggedInUser.save()
            await userToFollow.save()

            return res.status(200).json({
                message: "Unfollowed",
            })
        }
        else {
            loggedInUser.following.push(userToFollow._id)
            userToFollow.followers.push(loggedInUser._id)

            await loggedInUser.save()
            await userToFollow.save()
            return res.status(200).json({
                message: "Following",
            })
        }


    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: error.message
        })
    }
}


//Update || PUT || Private
export const Update = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const { name, username, email, about } = req.body

        //Verifyng if username or email already used
        const checkUserName = await User.findOne({ username })

        if (checkUserName && checkUserName._id.toString() !== user._id.toString()) {
            return res.status(400).send({
                message: "Username is already taken"
            })
        }

        const checkUserEmail = await User.findOne({ email })
        if (checkUserEmail && checkUserEmail._id.toString() !== user._id.toString()) {
            return res.status(400).send({
                message: "Email is used try diffrent one"
            })
        }

        //Handling File Upload and Cloudinary
        let myCloud

        if (req.file) {
            if (user.avatar.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id,
                    { folder: "avatars" })
            }

            const avatar = getDataUri(req.file)

            myCloud = await cloudinary.uploader.upload(avatar.content,
                { folder: "avatars" })
        }

        //Updating User Account
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            username: username ? username : user.username,
            name: name,
            email: email || user.email,
            avatar: {
                url: myCloud?.secure_url || user.avatar.url,
                public_id: myCloud?.public_id || user.avatar.public_id
            },
            about: about || user.about
        }, { new: true })

        return res.status(200).json({
            message: "Profile Updated",
            user: updatedUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        })
    }

}


//Update Password || PUT || Private
export const UpdatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const { oldPassword, newPassword } = req.body

        //Verifying Password
        const isPasswordTrue = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordTrue) {
            return res.status(401).send({
                message: "Wrong Password"
            })
        }

        user.password = newPassword
        await user.save()

        return res.status(200).json({
            message: "Password Updated"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: error.message
        })
    }

}


//Delete Profile || DELETE || Private
export const deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const followers = user.followers;
        const following = user.following;
        const userId = user._id;

        if (user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id,
                { folder: "avatars" })
        }

        await User.findByIdAndDelete(user._id);

        // Logout user after deleting profile
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        await Post.deleteMany({ user: userId });

        // Removing User from Following of Followers
        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);

            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);
            await follower.save();
        }

        // Removing User from Following's Followers
        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);

            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);
            await follows.save();
        }

        // removing all comments of the user from all posts
        const allPosts = await Post.find();

        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id);

            for (let j = 0; j < post.comments.length; j++) {
                if (post.comments[j].user.toString() === userId.toString()) {
                    post.comments.splice(j, 1);
                }
            }
            await post.save();
        }

        // removing all likes of the user from all posts
        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id);

            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j].toString() === userId.toString()) {
                    post.likes.splice(j, 1);
                }
            }
            await post.save();
        }

        res.status(200).json({
            message: "Account Deleted",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//My Profile || GET || Private
export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "posts followers following"
        ).populate({
            path: 'posts'
        }).populate({
            path: 'followers',
            select: 'avatar username'
        }).populate({
            path: 'following',
            select: 'avatar username'
        });

        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//Other User Profile || GET || Public
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-email -password').populate({
            path: 'posts',
        }).populate({
            path: 'following',
            select: 'avatar username'
        }).populate({
            path: 'followers',
            select: 'avatar username'
        })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
};


//Search Users || GET || Public
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.query.name, $options: "i" },
        });

        res.status(200).json({
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//My All Posts || GET || Privated
export const getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user"
            );
            posts.push(post);
        }

        res.status(200).json({
            posts: posts.reverse(),
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//Other User Posts || GET || Public
export const getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const posts = [];

        for (let i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate(
                "likes comments.user"
            );
            posts.push(post);
        }

        res.status(200).json({
            posts,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//Search Results || GET || Public
export const getSearchResults = async (req, res) => {
    try {
        const { searchTerm } = req.query

        const users = await User.find({
            $or: [
                { name: new RegExp(searchTerm, 'i') },
                { username: new RegExp(searchTerm, 'i') }
            ]
        })

        const posts = await Post.find({
            $or: [
                { caption: new RegExp(searchTerm, 'i') },
            ]
        })

        res.status(200).json({
            userCount: users.length,
            users,
            postCount: posts.length,
            posts
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//JWT Function
const generateToken = async function (_id) {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}
