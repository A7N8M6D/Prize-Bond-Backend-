import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Jwt from "jsonwebtoken";
import { json } from "express";
import { Bond } from "../models/bonds.model.js";

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
  // Extract data from the request body
  const { fullname, email, username, password, userType, Location, number } = req.body;
  console.log("email", email);
  console.log("name ", fullname);
  console.log("Location", Location);
  console.log("Username ", username);
  console.log("usertype", userType);
  console.log("password", password);
  console.log("Number", number);

  // Validate required fields
  if ([fullname, email, username, password, userType, Location].some((field) => field?.trim() === "")) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate the number field
  if (number === "") {
    return res.status(400).json({ error: "Number field is required" });
  }
  
  if (!Number.isInteger(Number(number))) {
    return res.status(400).json({ error: "Number must be an integer" });
  }

  // Check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    return res.status(409).json({ error: "User with this email or username already exists" });
  }

  // Validate userType
  if (userType !== "user") {
    return res.status(400).json({ error: "Invalid userType" });
  }

  // Create user
  try {
    const user = await User.create({
      username,
      email,
      fullname,
      userType,
      password,
      Location,
      number,
    });

    // Remove sensitive fields from the created user object
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      return res.status(500).json({ error: "Something went wrong with the registration" });
    }

    // Return success response
    return res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
/*
 
 
-----------------        Sign IN User        -----------------


*/
const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email) {
    return res.status(400).json({ error: "Email is required!" });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User does not exist!" });
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password!" });
  }

  // Generate tokens
  const { accessToken, refreshToken } = await GenerRefreshAccessToken(user.id);

  // Fetch logged-in user data, excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Set cookies with options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  };

  // Send response with tokens and user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }, "User logged in successfully!")
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
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Fetch bonds associated with the user
    const bonds = await Bond.find({ user: user._id });

    // Selectively pick the required fields
    const userResponse = {
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      userType: user.userType,
      number: user.number,
      Location: user.Location,
      bonds: bonds.map(bond => ({
        PrizeBondType: bond.PrizeBondType,
        numberOfBonds: bond.PrizeBondNumber.length
      }))
    };

    return res.status(200).json(new ApiResponse(200, userResponse, "User fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, "An error occurred"));
  }
});
export {
  registerUser,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  GetCurrentUser,
};
