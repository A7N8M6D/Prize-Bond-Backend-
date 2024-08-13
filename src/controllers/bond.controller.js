import { BondWin } from "../models/Winbonds.model.js";
import { Bond } from "../models/bonds.model.js";
import { List } from "../models/list.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

/*
 
-----------------        Add Bond        -----------------

*/
// import asyncHandler from "express-async-handler";


// Add New Bond and Check for Winning Bond
const addNewBond = asynchandler(async (req, res) => {
  const { PrizeBondTyp, PrizeBondNumbe } = req.body;

  const useR = await User.findById(req.user?._id);

  const PrizeBondType = JSON.parse(PrizeBondTyp);
  let PrizeBondNumber = PrizeBondNumbe;

  if (PrizeBondType === null || PrizeBondNumber == null) {
    throw new ApiError(400, "Prize bond Number and Type are required");
  }

  const existedUser = await User.findOne({
    PrizeBondNumber,
  });

  const BondsAlreadyCreated = await Bond.findOne({
    user: useR._id,
    PrizeBondType: PrizeBondType,
  });

  if (BondsAlreadyCreated) {
    BondsAlreadyCreated.PrizeBondNumber =
      BondsAlreadyCreated.PrizeBondNumber.concat(PrizeBondNumber);
    await BondsAlreadyCreated.save();
    checkForWinningBond(BondsAlreadyCreated, PrizeBondNumber);
    return res
      .status(201)
      .json(
        new ApiResponse(200, BondsAlreadyCreated, "Bond Save Successfully")
      );
  } else {
    if (existedUser) {
      throw new ApiError(409, "Prize Bond Number already Exist");
    }

    const createdBond = await Bond.create({
      PrizeBondType,
      PrizeBondNumber,
      user: useR._id,
    });

    if (!createdBond) {
      throw new ApiError(500, "Bond not Save Something went wrong");
    }

    checkForWinningBond(createdBond, PrizeBondNumber);
    return res
      .status(201)
      .json(new ApiResponse(200, createdBond, "Bond Save Successfully"));
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
  let { number, type } = req.query;
  const user = req.user._id;
  console.log("user conatian bond", user);
  type = parseInt(type);
  try {
    // Find the bond by user and type, and remove the specific prize bond number from the array
    const updatedBond = await Bond.findOneAndUpdate(
      { user: user, PrizeBondType: type },
      { $pull: { PrizeBondNumber: number } },
      { new: true } // Return the updated document
    );

    if (updatedBond) {
      res
        .status(200)
        .json({
          message: "Prize bond number deleted successfully",
          updatedBond,
        });
    } else {
      res.status(404).json({ message: "Bond not found" });
    }
  } catch (error) {
    console.error("Error updating bond:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
});

/*
                                                         
                                                         
-----------------       Bond Check       -----------------
                                                        
                                                         
*/
const checkBonds = asynchandler(async (req, res) => {
  const { listId } = req.params;

  // Fetch the list details
  const list = await List.findById(listId);
  if (!list) {
    return res.status(404).json(new ApiError(404, "List not found"));
  }

  // Fetch all bonds
  const bonds = await Bond.find().populate("user");

  // Extract winning numbers from the list
  const winningNumbers = [
    { type: "First", numbers: list.FirstWin, amount: list.FirstPrize },
    { type: "Second", numbers: list.SecondWin, amount: list.SecondPrize },
    { type: "Third", numbers: list.ThirdWin, amount: list.ThirdPrize },
  ];

  // Check and save the winning bonds
  for (const bond of bonds) {
    for (const win of winningNumbers) {
      const matchedNumbers = bond.PrizeBondNumber.filter((number) =>
        win.numbers.includes(number)
      );

      if (matchedNumbers.length > 0) {
        await BondWin.create({
          PrizeBondNumber: matchedNumbers,
          user: bond.user,
          list: list._id,
          Month: list.Month,
          Year: list.Year,
          PrizeBondType: bond.PrizeBondType,
          PrizeType: win.type,
          PrizeAmount: win.amount,
        });
      }
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Bond check completed"));
});

/*
                                                         
                                                         
-----------------       Schedule Bond Check       -----------------
                                                        
                                                         
*/
const scheduleBondCheck = (listId) => {
  setTimeout(
    async () => {
      const req = { params: { listId } };
      const res = {
        status: (statusCode) => ({
          json: (response) =>
            console.log(
              `Status: ${statusCode}, Response: ${JSON.stringify(response)}`
            ),
        }),
      };
      await checkBonds(req, res);
    },
    5 * 60 * 1000
  ); // 5 minutes in milliseconds
};
/*
                                                         
                                                         
-----------------                          Check For Winning Bond       -----------------
                                                        
                                                         
*/

const checkForWinningBond = async (bond, PrizeBondNumber) => {
  const lists = await List.find({
    PrizeBondAmount: bond.PrizeBondType, // Assuming PrizeBondAmount is used as the type identifier
  });

  lists.forEach(async (list) => {
    let winPosition = [];

    if (list.FirstWin.includes(PrizeBondNumber)) {
      winPosition.push("First");
    }
    if (list.SecondWin.includes(PrizeBondNumber)) {
      winPosition.push("Second");
    }
    if (list.ThirdWin.includes(PrizeBondNumber)) {
      winPosition.push("Third");
    }

    if (winPosition.length > 0) {
      await BondWin.create({
        PrizeBondType: bond.PrizeBondType,
        PrizeBondNumber: PrizeBondNumber,
        user: bond.user,
        bond: bond._id,
        List: list._id,
        Month: list.Month,
        Year: list.Year,
        AmountWin: winPosition.includes("First")
          ? list.FirstPrize
          : winPosition.includes("Second")
            ? list.SecondPrize
            : list.ThirdPrize,
        WinPosition: winPosition,
      });
    }
  });
};

export { addNewBond, scheduleBondCheck, GetAllBond, UpdateBond, DeleteBond };
