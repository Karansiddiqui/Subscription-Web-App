import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



import userRouter from './routes/user.route.js'
app.use("/api/v1/users", userRouter)

import subsRouter from './routes/subs.route.js'
app.use("/api/v1/subs", subsRouter)

import articleRoute from './routes/article.route.js'
app.use('/api/v1/articles', articleRoute)





export { app }