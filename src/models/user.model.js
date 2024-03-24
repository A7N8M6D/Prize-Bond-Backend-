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
    profileImg: {
        type: String,
        required: true
        // You mentioned Cloudinary here, so it seems you're planning to store the image URL from Cloudinary
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
    Location:{
              type:String
    },
    refreshToken: {
        type: String
        // This field might be used for storing refresh tokens for authentication
    },
    UserInfo: {
        // Admin-related information
        adminInfo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdminBond'
        }],
        // Broker-related information
        brokerInfo: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"brokerInfo"
        }],
        // User-related bonds
        UserBonds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserBond'
        }],
        BrokerRequest: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BrokerRequest'
        }]

    }
}, {
    timestamps: true
});
userSchema.pre("save",async function( next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password ,10)
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