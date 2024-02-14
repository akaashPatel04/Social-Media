import express from "express"
import { CreatePost, commentOnPost, deleteComment, deletePost, getPostOfFollowing, getSinglePost, likeDislikePost, updateCaption } from "../controllers/post.js"
import isAuthenticated from "../middlewares/auth.js"
import { profileUpload } from "../middlewares/multer.js"

const router = express.Router()

router.post('/create', profileUpload, isAuthenticated, CreatePost)

router.route('/post/:id').get(isAuthenticated, likeDislikePost).put(isAuthenticated, updateCaption).delete(isAuthenticated, deletePost)

router.get('/p/:id', isAuthenticated, getSinglePost)

router.route('/posts').get(isAuthenticated, getPostOfFollowing)

router.route('/post/comment/:id').put(isAuthenticated, commentOnPost).delete(isAuthenticated, deleteComment)


export default router