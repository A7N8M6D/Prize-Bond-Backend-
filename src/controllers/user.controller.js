import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

const registerUser=asynchandler( async (req ,res)=>{
//get data from the user 

//validation 

//check if the user already exist     email   password

//check for images

// upload to clodinary

//user object  using create entry in db

//remove password and refresh token

//res recieve or not and user signed or not

//res return
const {fullName ,email ,username, password}=req.body
console.log("email",email);
console.log("name ", namee)
})


export {registerUser};