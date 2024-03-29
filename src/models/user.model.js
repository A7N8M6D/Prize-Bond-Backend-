import mongoose,{Schema, mongo} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    userType: {
        type: String,
        enum: ['admin', 'broker', 'user'],
        required: true
        // This field will hold the type of user: admin, broker, or user
    },
    password: {
        type: String,
        required: true
        // Assuming passwords are stored as strings (hashed and salted for security)
    },
    number:{
        type:Number,
        required:true
    },
    Location:{
              type:String,
              required:true
    },
    refreshToken: {
        type: String
        // This field might be used for storing refresh tokens for authentication
    }
}, {
    timestamps: true
});
userSchema.pre("save",async function( next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password ,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password)
{
    return await bcrypt.compare(password , this.password)
}
userSchema.methods.generatorAccesssToken =function(){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.nextTick.ACCESS_TOKEN_SECRET),{
        expirein:process.env.ACCESS_TOKEN_EXPIRY
    }
}
userSchema.methods.generateRefreshToken =function()
{
    return jwt.sign({
        _id:this._id,
        
    },
    process.nextTick.REFRESH_TOKEN_SECRET),{
        expirein:process.env.REFRESH_TOKEN_EXPIRY
    }
}
export const User=mongoose.model("User" ,userSchema)