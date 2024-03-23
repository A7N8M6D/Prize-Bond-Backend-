import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB =async ()=>{
    try{

         const conectionINstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
         console.log(`\n MOongoDB Conected !! DB Host ${conectionINstance.connection.host}`)
    }
    catch(error)
    {
         console.log(" Database conection Error :0");
         process.exit(1)
    }
}
export default connectDB;