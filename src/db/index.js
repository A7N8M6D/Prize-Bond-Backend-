import mongoose from "mongoose";
import  {DB_NAME}  from "../constant.js";
// import {MONGODB_URI} from "./../../.env"

const connectDB =async ()=>{
    try{

         const conectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
         console.log(`\n MOongoDB Conected !! DB Host ${conectionInstance.connection.host}`)
    }
    catch(error)
    {
         console.log(" Database conection Error :0" , error);
         process.exit(1)
    }
}
export default connectDB;