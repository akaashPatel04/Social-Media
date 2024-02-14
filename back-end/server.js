import express from "express";
const app = express()
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinrary from 'cloudinary'
import path from 'path'

//Route Imports
import postRouter from "./routes/postRoute.js";
import userRouter from "./routes/userRoute.js"

const __dirname = path.resolve()


//Middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config({ path: './back-end/.env' });


//Routes
app.use('/api', postRouter)
app.use('/api', userRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

//Databse Connection
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL).then((data) => {
        console.log(`Database Connected : ${data.connection.host}`);
    }).catch((err) => {
        console.log(err);
    })
}

connectDB()

//Cloudinary Config
cloudinrary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})


//PORT
app.listen(process.env.PORT, () => {
    console.log(`App running on PORT : ${process.env.PORT}`);
})