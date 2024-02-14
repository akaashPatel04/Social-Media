import jwt from 'jsonwebtoken'
import User from "../models/User.js"

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send({
                message: "Please Login"
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        if (!decode._id) {
            return res.status(401).send({
                message: "Session expired, Please login again"
            })
        }

        req.user = await User.findById(decode._id)

        next()
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            message: error.message
        })
    }
}

export default isAuthenticated