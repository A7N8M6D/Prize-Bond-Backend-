import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Jwt from "jsonwebtoken";
import { json } from "express";

const GenerRefreshAccessToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    console.log(user);
    const accessToken = user.generatorAccesssToken();
    console.log("start");
    console.log("accesstoken" + JSON.stringify(accessToken));
    console.log("1 accesss Token" + accessToken);
    const refresshToken = user.generateRefreshToken();
    console.log("1 refresh Token" + refresshToken);
    console.log("refresh Token" + JSON.stringify(refresshToken));
    user.refreshToken = refresshToken;
    await user.save({
      validateBeforeSave: false,
    });
    //console.log(user)
    return { accessToken, refresshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

/*
 
 
-----------------        Sign Up User        -----------------


*/

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
  const { fullname, email, username, password, userType, Location, number } =
    req.body;
  console.log("email", email);
  console.log("name ", fullname);
  console.log("Location", Location);
  console.log("Username ", username);
  console.log("usertype", userType);
  console.log("password", password);
  console.log("Number", number);

  if (
    [fullname, email, username, password, userType, Location].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are Required")
    
  }
  if (Number == "") {
    throw new ApiError(400, "Number Field are Required")
    
  }
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or password already exist")
    
  }
   if (userType !== "user") {

 
    throw new ApiError(400, "userType Error")
    
   }

  const user = await User.create({
    username,
    email,
    fullname,
    userType,
    password,
    Location,
    number,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -userType"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something Wrong with the registration")
      
  }
  console.log("hhzhxfzhjfgzhjzgfxj" + ApiError);
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Creted Successfully"));
});

/*
 
 
-----------------        Sign IN User        -----------------


*/

const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);
  if (!email) {
    throw new ApiError(400, "email is Required !");
  }
  const user = await User.findOne({ email });
  // console.log();
  if (!user) {
    throw new ApiError(404, "User Not Exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log("3");
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Password or Usernmae");
  }

  const { accessToken, refresshToken } = await GenerRefreshAccessToken(user.id);
  console.log("token send" + refresshToken, accessToken);
  const logginUser = await User.findById(user._id).select(
    "-password -refresToken"
  );
  const options = {
    httpOnly: true,
    // sameSite:"lax",
    // maxAge: 1000 * 1000,
    // path: "/",
    secure: false,
  };
  console.log("user access" + accessToken);
  console.log("user refresh" + refresshToken);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refresshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logginUser,
          accessToken,
          refresshToken,
        },
        "User LoggedIn Successfully"
      )
    );
});

/*
 
 
-----------------        RefreshAccessToken        -----------------


*/

const refrshAccessToken = asynchandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incommingRefreshToken) {
    throw ApiError(401, "Unathorized Access");
  }
  try {
    const decodedToken = Jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incommingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } = await GenerRefreshAccessToken(
      user._id
    );
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access token Refreshed"
        )
      );
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid Refresh Token ");
  }
});

/*
 
 
-----------------        Sign Out        -----------------


*/

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
/*
 
 
-----------------        Change Password        -----------------


*/

const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPassword = await user.isPasswordCorrect(oldPassword);
  console.log("Current Password" + isPassword);
  if (!isPassword) {
    throw new ApiError(400, "Invalid old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changd Successfully"));
});

/*
 
 
-----------------        Get Current User        -----------------


*/

const GetCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Fetched Succesfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  GetCurrentUser,
};
