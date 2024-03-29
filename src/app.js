import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limit } from "./constant.js";
import "../"
const app= express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
//for jason
app.use(express.json({limit}))
//
app.use(express.urlencoded({extended:true , limit}))
//for images , pdf store
app.use(express.static("public"))
app.use(cookieParser())
//routes
import userRouter from "./routes/user.routes.js";


//routes declaration
app.use("/api/v1/users",userRouter)
export {app};