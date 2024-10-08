import connectDB from "./src/db/index.js";
import dotenv from 'dotenv';
import { app } from "./src/app.js";
// import { bondCheckQueue } from './path-to-your-queue-file';

// bondCheckQueue.on('completed', (job) => {
//   console.log(`Bond check completed for list ${job.data.listId}`);
// });

// bondCheckQueue.on('failed', (job, err) => {
//   console.error(`Bond check failed for list ${job.data.listId}: ${err.message}`);
// });

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

