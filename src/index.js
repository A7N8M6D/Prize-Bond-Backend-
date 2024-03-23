//import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constant.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({
    path: '.env' // Specify the path to the directory containing the .env file
});

// Call connectDB function to establish the database connection
connectDB();




/*
;(
   async ()=>{
     try{
           await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     }catch(error)
     {
        console.error("Databse connection error",error )
        throw error;
     }
    }
)();
*/