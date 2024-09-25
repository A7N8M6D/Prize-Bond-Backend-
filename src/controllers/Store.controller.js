import { Bond } from "../models/bonds.model.js";
import { Store } from "../models/store.mdel.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

/*
 
 
-----------------        Add Store        -----------------


*/

const addStore = asynchandler(async (req, res) => {
  try {
    const { Description, city, area, number, email, Name } = req.body;
    console.log("data", Description, city, area, email, Name);
    const useR = await User.findById(req.user?._id);
    if (!useR) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (!Description?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Description field is required",
      });
    }

    if (!city?.trim()) {
      return res.status(400).json({
        success: false,
        error: "City field is required",
      });
    }

    if (!area?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Area field is required",
      });
    }

    // Fallback to user data if fields are not provided
    const num = number || useR.number;
    const eml = email || useR.email;
    const namm = Name || useR.fullname;

    // Uncomment if checking for existing stores
    // const existedStore = await Store.findOne({ User: req.user?._id });
    // if (existedStore) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Store already exists",
    //   });
    // }

    const createdStore = await Store.create({
      Description,
      City: city,
      Area: area,
      number: num,
      Email: eml,
      Name: namm,
      User: req.user?._id,
    });

    if (!createdStore) {
      return res.status(500).json({
        success: false,
        error: "Store not saved. Something went wrong.",
      });
    }

    return res.status(201).json({
      success: true,
      data: createdStore,
      message: "Store created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred",
    });
  }
});

/*
                                                         
                                                         
-----------------       Personal Store        -----------------
                                                        
                                                         
*/
const GetPersonalStore = asynchandler(async (req, res) => {
  const allstore = req.user._id;
  console.log("sdsd" + allstore);
  const stores = await Store.find({ user: allstore });
  console.log("sdasdasd" + stores);
  return res
    .status(200)
    .json(new ApiResponse(200, stores, "Store Fetched Succesfully"));
});
/*
                                                         
                                                         
-----------------       Get  Store        -----------------
                                                        
                                                         
*/

const GetStore = asynchandler(async (req, res) => {
  const userId = req.user._id; // Extract user ID from the request

  console.log("User ID: " + userId);

  try {
    // Find the store by the associated User ID
    const store = await Store.findOne({ User: userId });

    if (!store) {
      return res.status(404).json({ error: "Store Not Found" });
      // return res.status(404).json(new ApiResponse(404, null, "Store Not Found"));
    }

    console.log("Fetched Store: ", store);

    return res
      .status(200)
      .json(new ApiResponse(200, store, "Store Fetched Successfully"));
  } catch (error) {
    console.error("Error fetching store: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to Fetch Store"));
  }
});

/*
 
                                                         
-----------------       All Store        -----------------
                                                        
                                                         
*/

const GetAllStore = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const location = req.query.location; // City provided in query
  const town = req.query.town; // Area (town) provided in query

  console.log("location", location);
  console.log("town", town);

  // Build query based on location and town
  let query = {};
  if (location) {
    query.City = location; // Filter by city
    if (town) {
      query.Area = town; // Filter by town if both location and town are provided
    }
  }

  try {
    // Fetch distinct areas (towns) for the given city (location)
    let distinctAreas = [];
    if (location) {
      distinctAreas = await Store.distinct("Area", { City: location });
    }

    // Fetch paginated stores based on the query (filtered by city and optionally town)
    const stores = await Store.find(query).skip(skip).limit(limit).exec();
    const totalStores = await Store.countDocuments(query);
    const totalPages = Math.ceil(totalStores / limit);

    // Send response with stores and distinct areas
    res.json({
      page,
      totalPages,
      towns: distinctAreas, // Send distinct areas as "Towns"
      data: stores,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
                                                         
                                                         
-----------------       Update Bond        -----------------
                                                        
                                                         
*/

const UpdateStore = asynchandler(async (req, res) => {
  const { newDescription, store_id } = req.body; // Use newDescription for the updated description

  try {
    // Find the store by ID
    const store = await Store.findById(store_id);
    if (!store) {
      throw new ApiError(400, "Invalid Store");
    }

    // Update the description
    store.Description = newDescription;

    // Save the store with the updated description
    await store.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Store updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to update store"));
  }
});

/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
const DeleteStore = asynchandler(async (req, res) => {
  const { Store_id } = req.body;
  const deletedStore = await Store.findByIdAndDelete(Store_id);

  // Check if the bond exists
  if (!deletedStore) {
    throw new ApiError(400, " Store Not Deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Store Delete Successfully"));
});
export {
  addStore,
  GetStore,
  UpdateStore,
  DeleteStore,
  GetAllStore,
  GetPersonalStore,
};
