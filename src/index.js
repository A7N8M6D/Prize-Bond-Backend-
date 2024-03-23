
import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { app } from "./app.js";

// Load environment variables from the .env file
dotenv.config({
    path: '.env' // Specify the path to the directory containing the .env file
});

// Call connectDB function to establish the database connection
connectDB().then(()=>{
    app.on("Error",(error)=>{
     console.log("Error " , error);
     throw error
    })
    app.listen(process.env.PORT ||8000 ,()=>{
        console.log(`Server i running at Port ${process.env.PORT} `)
    })
})
.catch((err)=>{
    console.log("Mongo DB connection Failed", err)
});




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