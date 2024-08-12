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
  const { Description, location, number, EMAil, Name } = req.body;

  const useR = await User.findById(req.user?._id);
  console.log("User in mobile",useR)
  if ([Description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Description field are required");
  }
  let locatt, num, eml, namm;
  if (location == "true") {
    locatt = useR.Location;
  }
  if (number == "true") {
    num = useR.number;
  }
  if (EMAil == "true") {
    eml = useR.email;
  }
  if (Name == "true") {
    namm = useR.fullname;
  }
  // const existedStore = await Store.findById({
  //   req.user?._id
  // });
  // console.log("user of bond" + useR._id);
  // if (existedStore) {
  //   throw new ApiError(409, "Store already Exist");
  // }

  const createdStore = await Store.create({
    Description,
    Location: locatt,
    number: num,
    Email: eml,
    Name: namm,
    User: req.user?._id,
  });
  if (!createdStore) {
    throw new ApiError(500, "Store not Save Something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdStore, "Store Creted Successfully"));
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
  const storeId = req.query.id;  // Extract store ID from request parameters
  console.log("Store ID: " + storeId);

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json(new ApiResponse(404, null, "Store Not Found"));
    }
    console.log("Fetched Store: ", store);

    return res.status(200).json(new ApiResponse(200, store, "Store Fetched Successfully"));
  } catch (error) {
    console.error("Error fetching store: ", error);
    return res.status(500).json(new ApiResponse(500, null, "Failed to Fetch Store"));
  }
});


/*
 
                                                         
-----------------       All Store        -----------------
                                                        
                                                         
*/

const GetAllStore = asynchandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const location = req.query.location;

  let query = {};
  if (location) {
    query.Location = location;
  }

  try {
    const stores = await Store.find(query).skip(skip).limit(limit).exec();
    const totalStores = await Store.countDocuments(query);
    const totalPages = Math.ceil(totalStores / limit);

    res.json({
      page,
      totalPages,
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
  const { Description, newDescription, store_id } = req.body;

  const store = await Store.findById(store_id);
  if (!store) {
    throw new ApiError(400, "Invalid Store");
  }
  Store.Description = Description;

  await Store.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Store changd Successfully"));
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
export { addStore, GetStore, UpdateStore, DeleteStore, GetAllStore };
