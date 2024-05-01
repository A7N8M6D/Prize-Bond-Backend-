import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const verifyJWT = asynchandler(async (req, _, next) => {
  try {
    const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("level 1");
    console.log("refreshtoken" + JSON.stringify(token));
    if (!token) {
      throw new ApiError(401, "Unathorized Request");
      
    }
    console.log("process.env.ACCESS_TOKEN_SECRET",process.env.ACCESS_TOKEN_SECRET)
    console.log("2");
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("3");
    console.log("decodedToken" + JSON.stringify(decodedToken));

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    console.log("4");
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
      console.log("5");
    }
    req.user = user;
    console.log("end");
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid Access Token");
  }
});
