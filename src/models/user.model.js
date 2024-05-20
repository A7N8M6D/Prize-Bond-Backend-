import mongoose, { Schema, mongo } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,

      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,

      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    userType: {
      type: String,
      enum: ["admin", "broker", "user"],
      required: true,
      // This field will hold the type of user: admin, broker, or user
    },
    password: {
      type: String,
      required: true,
      // Assuming passwords are stored as strings (hashed and salted for security)
    },
    number: {
      type: Number,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      // This field might be used for storing refresh tokens for authentication
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generatorAccesssToken = function () {
  try {
    console.log("Generating access token...");

    // Generate access token using jwt.sign()
    const accessToken = jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    console.log("Access token generated successfully");
    return accessToken;
  } catch (error) {
    // Handle any errors that occur during token generation
    console.error("Error generating access token:", error);
    throw new Error("Failed to generate access token");
  }
};

userSchema.methods.generateRefreshToken = function () {
  try {
    console.log("Generating refresh token...");

    // Generate refresh token using jwt.sign()
    const refreshToken = jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    console.log("Refresh token generated successfully");
    return refreshToken;
  } catch (error) {
    // Handle any errors that occur during token generation
    console.error("Error generating refresh token:", error);
    throw new Error("Failed to generate refresh token");
  }
};
export const User = mongoose.model("User", userSchema);
