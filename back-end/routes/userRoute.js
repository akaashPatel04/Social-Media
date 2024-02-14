import express from "express"
import { Follow, Login, Logout, Register, Update, UpdatePassword, deleteMyProfile, getMyPosts, getUserPosts, getUserProfile, myProfile, getSearchResults } from "../controllers/user.js"
import isAuthenticated from "../middlewares/auth.js"
import { profileUpload } from "../middlewares/multer.js"

const router = express.Router()

router.post('/register', Register)

router.post('/login', Login)

router.get('/logout', Logout)

router.route('/follow/:id').get(isAuthenticated, Follow)

router.put('/update', isAuthenticated, profileUpload, Update)

router.put('/update/password', isAuthenticated, UpdatePassword)

router.delete('/profile', isAuthenticated, deleteMyProfile)

router.get('/profile', isAuthenticated, myProfile)

router.get('/profile/:id', isAuthenticated, getUserProfile)

router.get('/myposts', isAuthenticated, getMyPosts)

router.get('/user/post/:id', isAuthenticated, getUserPosts)

router.get('/search', isAuthenticated, getSearchResults)


export default router