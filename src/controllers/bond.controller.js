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

const addNewBond = asynchandler(async (req, res) => {
  const { PrizeBondTyp, PrizeBondNumbe } = req.body;

  const useR = await User.findById(req.user?._id);
  if (!useR) {
    throw new ApiError(404, "User not found");
  }

  console.log("Prize Bond", PrizeBondNumbe);
  const PrizeBondType = JSON.parse(PrizeBondTyp);
  
  // Ensure PrizeBondNumbe is a string
  let PrizeBondNumber = PrizeBondNumbe.toString().trim();

  if (!PrizeBondType || !PrizeBondNumber) {
    throw new ApiError(400, "Prize bond Number and Type are required");
  }

  const BondsAlreadyCreated = await Bond.findOne({
    user: useR._id,
    PrizeBondType,
  });

  if (BondsAlreadyCreated) {
    if (BondsAlreadyCreated.PrizeBondNumber.includes(PrizeBondNumber)) {
      throw new ApiError(409, "Prize Bond Number already exists");
    }

    BondsAlreadyCreated.PrizeBondNumber.push(PrizeBondNumber);
    await BondsAlreadyCreated.save();
  } else {
    const createdbond = await Bond.create({
      PrizeBondType,
      PrizeBondNumber: [PrizeBondNumber],
      user: useR._id,
    });

    if (!createdbond) {
      throw new ApiError(500, "Bond not saved, something went wrong");
    }
  }

  // Check if the bond number exists in the List model
  const matchingList = await List.findOne({
    $or: [
      { FirstWin: PrizeBondNumber },
      { SecondWin: PrizeBondNumber },
      { ThirdWin: PrizeBondNumber },
    ],
  });

  if (matchingList) {
    const winPosition = [];
    if (matchingList.FirstWin.includes(PrizeBondNumber)) {
      winPosition.push("First");
    }
    if (matchingList.SecondWin.includes(PrizeBondNumber)) {
      winPosition.push("Second");
    }
    if (matchingList.ThirdWin.includes(PrizeBondNumber)) {
      winPosition.push("Third");
    }

    const bondWin = await BondWin.create({
      PrizeBondType,
      PrizeBondNumber,
      user: useR._id,
      bond: BondsAlreadyCreated?._id,
      List: matchingList._id,
      Month: matchingList.Month,
      Year: matchingList.Year,
      AmountWin: matchingList.PrizeBondAmount,
      WinPosition: winPosition,
    });

    if (!bondWin) {
      throw new ApiError(500, "Failed to save winning bond");
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(200, { message: "Bond added successfully" }));
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
  console.log("user conatian bond",user)
type=parseInt ( type)
  try {
    // Find the bond by user and type, and remove the specific prize bond number from the array
    const updatedBond = await Bond.findOneAndUpdate(
      { user: user, PrizeBondType: type },
      { $pull: { PrizeBondNumber: number } },
      { new: true } // Return the updated document
    );

    if (updatedBond) {
      res.status(200).json({ message: 'Prize bond number deleted successfully', updatedBond });
    } else {
      res.status(404).json({ message: 'Bond not found' });
    }
  } catch (error) {
    console.error('Error updating bond:', error);
    res.status(500).json({ message: 'An error occurred', error });
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
    return res.status(404).json(new ApiError(404, 'List not found'));
  }

  // Fetch all bonds
  const bonds = await Bond.find().populate('user');

  // Extract winning numbers from the list
  const winningNumbers = [
    { type: 'First', numbers: list.FirstWin, amount: list.FirstPrize },
    { type: 'Second', numbers: list.SecondWin, amount: list.SecondPrize },
    { type: 'Third', numbers: list.ThirdWin, amount: list.ThirdPrize },
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

  return res.status(200).json(new ApiResponse(200, null, 'Bond check completed'));
});

// Schedule the bond check to run five minutes after list upload
const scheduleBondCheck = (listId) => {
  setTimeout(async () => {
    const req = { params: { listId } };
    const res = {
      status: (statusCode) => ({
        json: (response) => console.log(`Status: ${statusCode}, Response: ${JSON.stringify(response)}`),
      }),
    };
    await checkBonds(req, res);
  }, 5 * 60 * 1000); // 5 minutes in milliseconds
};



export { addNewBond,scheduleBondCheck, GetAllBond, UpdateBond, DeleteBond };
