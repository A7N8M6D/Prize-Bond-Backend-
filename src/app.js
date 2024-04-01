import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limit } from "./constant.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

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
app.use((req, res, next) => {
    const currentDate = new Date();
console.log('Current Date:', currentDate.toLocaleString());

    const user =verifyJWT
    console.log("APPLIcation Level MiddleWare"+user);
    next()
  })
//routes
import userRouter from "./routes/user.routes.js";
import BondRouter from "./routes/bond.router.js"
import FormRouter from "./routes/Form.router.js"
import StoreRouter from "./routes/Store.router.js"
//routes declaration
app.use("/api/v1/users",userRouter)

app.use("/api/v1/bonds",BondRouter)
app.use("/api/v1/Store",StoreRouter)
app.use("/api/v1/Form",FormRouter)

export {app};