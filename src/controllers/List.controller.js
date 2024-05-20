// import { listenerCount } from "process";
import { Bond } from "../models/bonds.model.js";
import { List } from "../models/list.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import fs from "fs";

/*
 
 
-----------------        Add List        -----------------


*/

const addNewList = asynchandler(async (req, res) => {
  let FirstWinPrize, SecondWinPrize, ThirdWinPrize;
let Date,Month,Year,PrizeBondAmount,FirstWin,FirstPrize,SecondPrize,SecondWin,ThirdPrize,ThirdWin
  console.log("File ", req.files?.List[0]);
  const avatarLocalPath = req.files?.List[0]?.path;

  fs.readFile(avatarLocalPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    console.log("File contents:", data);

    function extractFirstPrizeNumber(input, SplitedString, lineNumber) {
      let parts = input.split(SplitedString);

      if (parts.length > 1) {
        let afterPrize = parts[1].trim();

        if (SplitedString == "DRAW OF Rs.") {
          const newPrize = afterPrize.split("/-");
          const Prize = newPrize[0].trim().replace(/,/g, '');
          console.log(`Extracted Prize: ${Prize}`);
          return parseInt(Prize, 10);

        }

        if (SplitedString == "Date") {
          let regex = /(\d{2})\/(\d{2})\/(\d{4})/;
          let match = afterPrize.match(regex);
          if (match) {
            let day = parseInt(match[1].trim(), 10);
            let month = parseInt(match[2].trim(), 10);
            let year =parseInt(match[3].trim(), 10)
            return { day, month };
          } else {
            console.log("Invalid date format");
            return "no";
          }
        }

        if (SplitedString == "First Prize of" || SplitedString == "Second Prize of" || SplitedString == "Third Prize of") {
          let regex = /\b\d{6}\b/g;

          if (SplitedString == "First Prize of") {
            let firstWinPrize = afterPrize.split("First Prize of Rs.");
            firstWinPrize = firstWinPrize[0].trim();
            console.log("asdsad",firstWinPrize)
            firstWinPrize = firstWinPrize.split("/-");
            firstWinPrize = firstWinPrize[0].trim();
            firstWinPrize = parseInt(firstWinPrize.replace(/[^\d]/g, ''), 10);
            FirstWinPrize = firstWinPrize;
            }
            afterPrize = afterPrize.split("Second Prize of")[0];
          

          if (SplitedString == "Second Prize of") {
            let firstWinPrize = afterPrize.split("Second Prize of Rs.");
            firstWinPrize = firstWinPrize[0].trim();
            console.log("asdsad",firstWinPrize)
            firstWinPrize = firstWinPrize.split("/-");
            firstWinPrize = firstWinPrize[0].trim();
            firstWinPrize = parseInt(firstWinPrize.replace(/[^\d]/g, ''), 10);
            SecondWinPrize = firstWinPrize;
            afterPrize = afterPrize.split("Third Prize")[0];
          }

          if (SplitedString == "Third Prize of") {
            let firstWinPrize = afterPrize.split("Third Prize of Rs.");
            firstWinPrize = firstWinPrize[0].trim();
            console.log("asdsad",firstWinPrize)
            firstWinPrize = firstWinPrize.split("/-");
            firstWinPrize = firstWinPrize[0].trim();
            firstWinPrize = parseInt(firstWinPrize.replace(/[^\d]/g, ''), 10);
            ThirdWinPrize = firstWinPrize;
            afterPrize = afterPrize.split("Third Prize of Rs.")[0];
          }

          let matches = afterPrize.match(regex);
          return matches ? matches.map(num => parseInt(num.trim(), 10)) : [];
        }
      }

      return [];
    }

    
    
    
    let firstPrizeNumber = extractFirstPrizeNumber(data, "First Prize of", 2);
    let secondPrizeNumbers = extractFirstPrizeNumber(data, "Second Prize of", 2);
    let allPrizeNumbers = extractFirstPrizeNumber(data, "Third Prize of", 0);
    const DATE = extractFirstPrizeNumber(data, "Date", 1);
    const PrizeBond = extractFirstPrizeNumber(data, "DRAW OF Rs.");
    
    console.log("Prize",  PrizeBond);
    PrizeBondAmount=PrizeBond
    console.log("DATE", DATE);
    Date=DATE.day
    console.log("Date Bro",Date)
    // Date:DATE.day,
      Month=DATE.month,
      Year=DATE.year,
    console.log("First Win Prize ",  FirstWinPrize);
  
    console.log("First Prize Number:", firstPrizeNumber.length > 0 ? firstPrizeNumber : "First Prize Number not found.");
    console.log("Second Win Prize ", SecondWinPrize);
    const SecondWin=secondPrizeNumbers.join(", ") 
    console.log("Third Win Prize ", ThirdWinPrize);
    ThirdPrize=allPrizeNumbers.join(", ") 
    
    FirstWin:firstPrizeNumber;
    FirstPrize=FirstWinPrize;
    SecondPrize=SecondWinPrize;
    
    
  })
    
    
  console.log("asdsa",Date)
  console.log("dsaddad",Date,Month,Year,PrizeBondAmount,FirstWin,FirstPrize,SecondPrize,SecondWin,ThirdPrize,ThirdWin)
   const list =await List.create({
    Date,
    Month,
    Year,
    PrizeBondAmount,
    FirstWin,
    FirstPrize,
    SecondPrize,
    SecondWin,
    ThirdPrize,
    ThirdWin
  })
  if (!list) {
  
    return res
    .status(500)
    .json(new ApiError(
      500,
      "Something Went Wrong with the Registration of User"
    ));
  }
   
  return res.status(201).json({ status: 200,  message: "List saved successfully" });
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
    bonnd_id,
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
  const { bond_id } = req.body;
  const deletedBond = await Bond.findByIdAndDelete(bond_id);

  // Check if the bond exists
  if (!deletedBond) {
    throw new ApiError(400, " Bond Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Bond Delete Successfully"));
});
export { addNewList, GetAllBond, UpdateBond, DeleteBond };
