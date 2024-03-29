import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
const GenerRefreshAccessToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generatorAccesssToken(userID);
    const refreshToken = user.generateRefreshToken(userID);
    User.refreshToken = refreshToken;
    await User.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const registerUser = asynchandler(async (req, res) => {
  //get data from the user

  //validation

  //check if the user already exist     email   password

  //check for images

  // upload to clodinary

  //user object  using create entry in db

  //remove password and refresh token

  //res recieve or not and user signed or not

  //res return
  const { fullname, email, username, password, userType, Location } = req.body;
  console.log("email", email);
  console.log("name ", fullname);
  console.log("Location", Location);
  console.log("Username ", username);
  console.log("usertype", userType);
  console.log("password", password);
  if (
    [fullname, email, username, password, userType, Location].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are Required");
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or password already exist");
  }
  const user = await User.create({
    username,
    email,
    fullname,
    userType,
    password,
    Location,
  });
  const createdUser = await User
    .findById(user._id)
    .select("-password -refreshToken -userType");
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something Went Wrong with the Registration of User"
    );
  }
  return res.status(201).json(
    new ApiResponse(200 ,createdUser,"User Creted Successfully")
  )
});

export { registerUser };
