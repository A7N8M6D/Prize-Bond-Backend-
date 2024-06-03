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
  console.log("Prize Bond", PrizeBondNumbe);
  // const PrizeBondNumber=parseInt(PrizeBondNumbe),PrizeBondType=parseInt(PrizeBondTyp)

  const PrizeBondType = JSON.parse(PrizeBondTyp);

  console.log("1");
  let PrizeBondNumber = PrizeBondNumbe;
  // Ensure PrizeBondNumbers is an array
  console.log("2");

  // const PrizeBondNumber
  console.log("Prize Bond 1", PrizeBondNumber);
  if ((PrizeBondType === null) | (PrizeBondNumber == null)) {
    throw new ApiError(400, "Prize bond Number and Type are required");
  }
  const existedUser = await User.findOne({
    PrizeBondNumber,
  });
  console.log("3");
  const BondsAlreadyCreated = await Bond.findOne({
    user: useR._id,
    PrizeBondType: PrizeBondType,
  });
  console.log("4");
  if (BondsAlreadyCreated) {
    const filteredBondss = BondsAlreadyCreated.PrizeBondNumber;
    const filteredBondsss = filteredBondss.concat(PrizeBondNumber);
    const newB = (BondsAlreadyCreated.PrizeBondNumber = filteredBondsss);
    console.log("5");
    // Save the updated document
    await BondsAlreadyCreated.save();
    console.log("pop", filteredBondsss);
    return res
      .status(201)
      .json(new ApiResponse(200, newB, "Bond Save Successfully"));
  } else {
    // console.log("ggjgh",filteredBonds);
    // console.log("Type and user", BondsAlreadyCreated)
    console.log("user of bond" + useR._id);
    if (existedUser) {
      throw new ApiError(409, "Prize Bond Number already Exist");
    }
    console.log(PrizeBondNumber);
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
  const { BondType } = req.query;
  console.log("first");
  const allbonds = req.user._id;
  console.log("Second");
  const bonds = await Bond.find({ user: allbonds, PrizeBondType: BondType });
  console.log("bonds", bonds);
  return res
    .status(200)
    .json(new ApiResponse(200, bonds, "User Fetched Succesfully"));
});
/*
                                                         
                                                         
-----------------------------------------------------------
                                                        
                                                         
*/

/*
                                                         
                                                         
-----------------       Update Bond        -----------------
                                                        
                                                         
*/

const UpdateBond = asynchandler(async (req, res) => {
  const { oldNumber, newNumber, BondType } = req.query;
  const User = req.user._id;
  console.log("BOnd Number to be updaated", newNumber, "---", oldNumber);
  console.log("asdda", User);
  console.log("here");
  const Bonds = await Bond.findOne({
    user: User._id,
    PrizeBondType: BondType,
  });
  console.log("Bonds", Bonds);
  let updated = false;
  // Step 3: Perform the replacement
  Bonds.PrizeBondNumber = Bonds.PrizeBondNumber.map((number) => {
    console.log("number", number, "oldNumber", oldNumber);
    if (number === oldNumber) {
      updated = true;
      console.log(`Replacing ${number} with ${newNumber}`);
      return newNumber;
    }
    return number;
  });
  if (!updated) {
    return res
      .status(404)
      .json({ message: "Old number not found in the bond" });
  }
  console.log("33");
  const nBond = await Bonds.save();
  console.log("bond", nBond);
  // const bond = await Bond.findById(bonnd_id);
  if (!nBond) {
    throw new ApiError(400, "Invalid Bond");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { nBond }, "Bond changd Successfully"));
});
/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
const DeleteBond = asynchandler(async (req, res) => {
  const {  number,type } = req.query;
  const User = req.user._id;
try {
  // Find the bond by ID and update it by pulling the specific prize bond number from the array
  const updatedBond = await Bond.findOneAndUpdate(
    { user: User, PrizeBondType: type },
    { $pull: { PrizeBondNumber: number } },
    { new: true } // Return the updated document
  );

  if (updatedBond) {
    res.status(200).json({ message: 'Prize bond number deleted successfully', updatedBond });
  } else {
    res.status(404).json({ message: 'Bond not found' });
  }
} catch (error) {
  res.status(500).json({ message: 'An error occurred', error });
}

});
export { addNewBond, GetAllBond, UpdateBond, DeleteBond };
