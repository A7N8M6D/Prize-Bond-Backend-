import { Bond } from "../models/bonds.models.js";
import { Store } from "../models/store.mdels.js";
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
const GetStore = asynchandler(async (req, res) => {
  const allstore = req.user._id;
  console.log("sdsd" + allstore);
  const stores = await Store.find({ user: allstore });
  console.log("sdasdasd" + stores);
  return res
    .status(200)
    .json(new ApiResponse(200, stores, "Store Fetched Succesfully"));
});

/*
                                                         
                                                         
-----------------       All Store        -----------------
                                                        
                                                         
*/

const GetAllStore = asynchandler(async (req, res) => {
  const { howMany, location } = req.body;
  const stores = await Store.find({});
  const numberOfStores = stores.length;
  // Calculate the end index based on howMany
  let howMan = parseInt(howMany);
  let endIndex = howMan + 2;

  // Declare variables to store selected stores
  let selectedStore, selectedStores;

  if (location.trim() !== "") {
    // Find the store with the specified location
    console.log("------------------All stores:----------------------", stores);
    console.log("how man" + howMan);
    selectedStore = stores.filter((store) => store.Location === location);
    if (howMan === 0) {
      selectedStores = selectedStore.slice(-1, endIndex);
    } else {
      selectedStores = selectedStore.slice(howMan, endIndex);
    }
    console.log(
      "----------------Selected stores:1-----------------",
      selectedStores
    );
  } else {
    // If no location specified, select stores based on howMany and endIndex
    console.log("------------------All stores:----------------------", stores);
    if (howMan === 0) {
      endIndex = endIndex - 1;
      selectedStores = stores.slice(endIndex);
    } else {
      selectedStores = stores.slice(howMan, endIndex);
    }
    console.log(
      "----------------Selected stores:2-----------------",
      selectedStores
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, selectedStores, "Stores Fetched Successfully"));
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
