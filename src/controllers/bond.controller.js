import { Bond } from "../models/bonds.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

/*
 
 
-----------------        Add Bond        -----------------


*/

const addNewBond = asynchandler(async (req, res) => {
  const { PrizeBondTyp, PrizeBondNumbe } = req.body;

  const useR = await User.findById(req.user?._id);

  // if ([BuyYear, Buymonths].some((field) => field?.trim() === "")) {
  //   throw new ApiError(400, "All fields are required");
  // }
  console.log("Prize Bond",PrizeBondNumbe)
// const PrizeBondNumber=parseInt(PrizeBondNumbe),PrizeBondType=parseInt(PrizeBondTyp)


const PrizeBondType = JSON.parse(PrizeBondTyp);

console.log("1")
let PrizeBondNumber =JSON.parse( PrizeBondNumbe);
 // Ensure PrizeBondNumbers is an array
 console.log("2")

// const PrizeBondNumber
console.log("Prize Bond 1",PrizeBondNumber)
  if ((PrizeBondType === null) | (PrizeBondNumber == null)) {
    throw new ApiError(400, "Prize bond Number and Type are required");
  }
  const existedUser = await User.findOne({
    PrizeBondNumber,
  });
  console.log("3")
  const BondsAlreadyCreated = await Bond.findOne({
    user: useR._id,
    PrizeBondType: PrizeBondType
  });
  console.log("4")
  if (BondsAlreadyCreated) {
    const filteredBondss = BondsAlreadyCreated.PrizeBondNumber;
    const filteredBondsss = filteredBondss.concat(PrizeBondNumber);
    const newB=BondsAlreadyCreated.PrizeBondNumber = filteredBondsss;
    console.log("5") 
    // Save the updated document
    await BondsAlreadyCreated.save();
    console.log("pop", filteredBondsss);
    return res
    .status(201)
    .json(new ApiResponse(200, newB, "Bond Save Successfully"));
  }
  else{
// console.log("ggjgh",filteredBonds);
// console.log("Type and user", BondsAlreadyCreated)
  console.log("user of bond" + useR._id);
  if (existedUser) {
    throw new ApiError(409, "Prize Bond Number already Exist");
}
console.log( PrizeBondNumber)
  const createdbond = await Bond.create({
    PrizeBondType,
    PrizeBondNumber,
    user: useR._id,
});
  if (!createdbond) {
    throw new ApiError(500, "Bond not Save Something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdbond, "Bond Save Successfully"));
}
});

/*
                                                         
                                                         
-----------------       All Bond        -----------------
                                                        
                                                         
*/
const GetAllBond = asynchandler(async (req, res) => {
  const allbonds = req.user._id;
  const bonds = await Bond.find({ user: allbonds });

  return res
    .status(200)
    .json(new ApiResponse(200, bonds, "User Fetched Succesfully"));
});
/*
                                                         
                                                         
-----------------       Update Bond        -----------------
                                                        
                                                         
*/

const UpdateBond = asynchandler(async (req, res) => {
  const {
    oldType,
    newType,
    oldNumber,
    newNumber,
    oldYear,
    NewYear,
    oldMonth,
    newMonth,
    bonnd_id
  } = req.body;

  const bond = await Bond.findById(bonnd_id);
  if (!bond) {
    throw new ApiError(400, "Invalid Bond");
  }
  bond.PrizeBondNumber = newNumber;
  bond.PrizeBondType = newType;
  bond.BuyYear = NewYear;
  bond.Buymonths = newMonth;
  await bond.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bond changd Successfully"));
});
/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
const DeleteBond = asynchandler(async (req, res) => {
  const {bond_id}=req.body
  const deletedBond = await Bond.findByIdAndDelete(bond_id);

  // Check if the bond exists
  if (!deletedBond) {
    throw new ApiError(400, " Bond Not Found");
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bond Delete Successfully"));
});
export { addNewBond, GetAllBond, UpdateBond, DeleteBond };
