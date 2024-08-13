import { Bond } from "../models/bonds.model.js";
import { List } from "../models/list.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import fs from "fs/promises"; // Import the promises API from the fs module
import { scheduleBondCheck } from "./bond.controller.js";
import { addBondWinJob } from "../utils/bondwinjobs.js";

// import fs from "fs";

/*
 
 
-----------------        Add List        -----------------


*/

const addNewList = asynchandler(async (req, res) => {
  let FirstWinPrize, SecondWinPrize, ThirdWinPrize;
console.log("File")
  //console.log("File ", req.files?.List[0]);
  console.log("List",req.files)
  console.log("List",req.files.List[0])
  const avatarLocalPath = req.files?.List[0]?.path;

  try {
    const data = await fs.readFile(avatarLocalPath, "utf8");
    console.log("File contents:", data);

    function extractFirstPrizeNumber(input, SplitedString, lineNumber) {
      let parts = input.split(SplitedString);

      if (parts.length > 1) {
        let afterPrize = parts[1].trim();

        if (SplitedString == "DRAW OF Rs.") {
          const newPrize = afterPrize.split("/-");
          const Prize = newPrize[0].trim().replace(/,/g, "");
          console.log(`Extracted Prize: ${Prize}`);
          return Prize;
        }

        if (SplitedString == "Date") {
          let regex = /(\d{2})\/(\d{2})\/(\d{4})/;
          let match = afterPrize.match(regex);
          if (match) {
            let day = parseInt(match[1].trim(), 10);
            let month = parseInt(match[2].trim(), 10);
            let year = parseInt(match[3].trim(), 10);
            return { day, month, year };
          } else {
            console.log("Invalid date format");
            return "no";
          }
        }

        if (
          SplitedString == "First Prize of" ||
          SplitedString == "Second Prize of" ||
          SplitedString == "Third Prize of"
        ) {
          let regex = /\b\d{6}\b/g;

          if (SplitedString == "First Prize of") {
            let firstWinPrize = afterPrize.split("First Prize of Rs. ");
            firstWinPrize = firstWinPrize[0].trim();
            console.log("asdsad", firstWinPrize);
            firstWinPrize = firstWinPrize.split("/-");
            firstWinPrize = firstWinPrize[0].trim();
            FirstWinPrize = firstWinPrize;
          }
          afterPrize = afterPrize.split("Second Prize of")[0];

          if (SplitedString == "Second Prize of") {
            let firstWinPrize = afterPrize.split("Second Prize of Rs. ");
            firstWinPrize = firstWinPrize[0].trim();
            console.log("asdsad", firstWinPrize);
            firstWinPrize = firstWinPrize.split("/-");
            firstWinPrize = firstWinPrize[0].trim();
            SecondWinPrize = firstWinPrize;
            afterPrize = afterPrize.split("Third Prize")[0];
          }

          if (SplitedString == "Third Prize of") {
            let firstWinPrize = afterPrize.split("Third Prize of Rs. ");
            firstWinPrize = firstWinPrize[0].trim();
            console.log("asdsad", firstWinPrize);
            firstWinPrize = firstWinPrize.split("/-");
            firstWinPrize = firstWinPrize[0].trim();
            ThirdWinPrize = firstWinPrize;
            afterPrize = afterPrize.split("Third Prize of Rs.")[0];
          }

          let matches = afterPrize.match(regex);
          console.log(matches, "dasdasdsadsadasdsajkhsjkdj");
          return matches ? matches.map((num) => num.trim()) : [];
        }
      }

      return [];
    }

    let Date,
      Month,
      Year,
      PrizeBondAmount,
      FirstWin,
      FirstPrize,
      SecondWin,
      SecondPrize,
      ThirdWin,
      ThirdPrize;

    let firstPrizeNumber = extractFirstPrizeNumber(data, "First Prize of", 2);
    let secondPrizeNumbers = extractFirstPrizeNumber(
      data,
      "Second Prize of",
      2
    );
    let allPrizeNumbers = extractFirstPrizeNumber(data, "Third Prize of", 0);
    const DATE = extractFirstPrizeNumber(data, "Date", 1);
    const PrizeBond = extractFirstPrizeNumber(data, "DRAW OF Rs.");

    console.log("Prize", PrizeBond);
    console.log("DATE", DATE);

    Date = DATE.day;
    Month = DATE.month;
    Year = DATE.year;
    PrizeBondAmount = PrizeBond;
    FirstWin = firstPrizeNumber;
    FirstPrize = FirstWinPrize;
    SecondWin = secondPrizeNumbers;
    SecondPrize = SecondWinPrize;
    ThirdWin = allPrizeNumbers;
    ThirdPrize = ThirdWinPrize;

    console.log("First Win Prize ", FirstWinPrize);
    console.log(
      "First Prize Number:",
      firstPrizeNumber.length > 0
        ? firstPrizeNumber
        : "First Prize Number not found."
    );
    console.log("Second Win Prize ", SecondWinPrize);
    console.log(
      "Second Prize Numbers:",
      secondPrizeNumbers.length > 0
        ? secondPrizeNumbers.join(", ")
        : "Second Prize Numbers not found."
    );
    console.log("Third Win Prize ", ThirdWinPrize);
    console.log(
      "All Prize Numbers:",
      allPrizeNumbers.length > 0
        ? allPrizeNumbers.join(", ")
        : "All Prize Numbers not found."
    );
    console.log(
      typeof Date,
      typeof Month,
      typeof Year,
      typeof PrizeBondAmount,
      typeof FirstWin,
      typeof FirstPrize,
      typeof SecondWin,
      typeof SecondPrize,
      typeof ThirdWin,
      typeof ThirdPrize
    );

    const list = await List.create({
      Date,
      Month,
      Year,
      PrizeBondAmount,
      FirstWin,
      FirstPrize,
      SecondWin,
      SecondPrize,
      ThirdWin,
      ThirdPrize,
    });

    if (!list) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Something Went Wrong with the Registration of User"
          )
        );
    }
    try {
      await addBondWinJob(list._id);
    } catch (error) {
      console.error("Error scheduling bond win job:", error);
      return res.status(500).json({ error: "Failed to schedule bond win job" });
    }
    // 500hahaha
    return res
      .status(201)
      .json(new ApiResponse(200, list, "List Saved Successfully"));
  } catch (err) {
    console.error("Error reading file:", err);
    return res.status(500).send("Error reading file");
  }
});

/*
                                                         
                                                         
-----------------       Verify List        -----------------
                                                        
                                                         
*/
const verifyList = asynchandler(async (req, res) => {
  const allbonds = req.user._id;
  const { Methode, ListId, Year } = req.query;
  if (Methode == "Delete") {
    const deletedBond = await List.findByIdAndDelete(ListId);
    if (deletedBond) {
      return res
        .status(200)
        .json(new ApiResponse(200, deletedBond, "Successfully Deleted"));
    }
  } else {
    const maxYearResult = await List.aggregate([
      {
        $group: {
          _id: null,
          maxYear: { $min: "$Year" },
        },
      },
    ]);

    let TotalYear = Year - maxYearResult[0].$min;
    if (TotalYear >= 6) {
      const result = await List.deleteMany({ Year: TotalYear });
      if (result) {
        return res
          .status(200)
          .json(new ApiResponse(200, result, "Successfully Saved"));
      }
    }
  }
});
/*
                                                         
                                                         
-----------------       Get List        -----------------
                                                        
                                                         
*/

const GetList = asynchandler(async (req, res) => {
  console.log("1");
  let { type,month, year } = req.query;
  // type = parseInt(type);
  month = parseInt(month);
  year = parseInt(year);
  if (typeof year !== 'number' || typeof month !== 'number' || typeof type !== 'string') {
    throw new Error('Invalid input: Year and month must be numbers, and type must be a string.');
}
  console.log(typeof type,month,year)
  console.log( type,month,year)
  // Check if month is NaN (Not a Number)

  if (isNaN(month) && year) {
    const uniqueMonth = await List.distinct("Month", { PrizeBondAmount: type , Year:year});

    const query = {  month: { $in: uniqueMonth } };
    if(!query)
      {
        return res
      .status(404)
      .json(new ApiResponse(404,  "Type Not Found"));
      }
    return res
      .status(200)
      .json(new ApiResponse(200, query, "Fetched Successfully"));
  } else if(isNaN(month) && isNaN(month)&& type){
    console.log("2")
    const uniqueYear = await List.distinct("Year", { PrizeBondAmount: type });

    const query = {  year: { $in: uniqueYear } };
    if(!query)
      {
        return res
      .status(404)
      .json(new ApiResponse(404,  "Month Not Found"));
      }
    return res
      .status(200)
      .json(new ApiResponse(200, query, "Fetched Successfully"));
      
  }else {
    const bonds = await List.find({ Year: year, Month: month,PrizeBondAmount: type  });
    if(!bonds)
      {
        return res
      .status(404)
      .json(new ApiResponse(404,  "Bond Not Found"));
      }
    return res
      .status(200)
      .json(new ApiResponse(200, bonds, "Fetched Successfully"));
  }
});


const GetInfo = asynchandler(async (req, res) => {
  try {
    let { type } = req.query;
    
    if (!type) {
      return res.status(400).json(new ApiResponse(400, "Type query parameter is required"));
    }

    // Construct the query object
    let query = { PrizeBondAmount: type };
    
    // Find documents with the specified PrizeBondAmount and project only Date, Month, and Year fields
    const bonds = await List.find(query, 'Date Month Year');
    
    if (!bonds.length) {
      return res.status(404).json(new ApiResponse(404, "No records found for the provided parameters"));
    }

    return res.status(200).json(new ApiResponse(200, bonds, "Fetched Successfully"));
  } catch (error) {
    console.error('Error fetching information:', error);
    return res.status(500).json(new ApiResponse(500, "Internal Server Error"));
  }
});
/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
// Import necessary modules and models
// const List = require('./models/List'); // Import your List model

// Define your asynchronous handler function
const FindNumber = asynchandler(async (req, res) => {
  let { number,PrizeBondAmount,Month,Year} = req.query;
  console.log(number);

  let results; // Declare results variable here

  try {
    // Query the List model to find documents matching the number
   // Construct the initial query conditions
let queryConditions = {};

// Check if Month is present in the query
if (Month) {
  queryConditions.Month = parseInt(Month);
}

// Check if Year is present in the query
if (Year) {
  queryConditions.Year = parseInt(Year);
}

// Check if PrizeBondAmount is present in the query
if (PrizeBondAmount) {
  queryConditions.PrizeBondAmount = PrizeBondAmount;
}

// Construct the final query
let query = {
  $and: [queryConditions, {
    $or: [
      { FirstWin: { $elemMatch: { $regex: number, $options: 'i' } }, FirstWin: { $size: 0 } },
      { SecondWin: { $elemMatch: { $regex: number, $options: 'i' } }, SecondWin: { $size: 0 } },
      { ThirdWin: { $elemMatch: { $regex: number, $options: 'i' } }, ThirdWin: { $size: 0 } }
    ]
  }]
};

// Run the query
results = await List.find(query).select({ 
  Date: 1,
  Month: 1,
  Year: 1,
  PrizeBondAmount: 1,
  FirstPrize: 1,
  SecondPrize: 1,
  ThirdPrize: 1,
  FirstWin: { $elemMatch: { $regex: number, $options: 'i' } },
  SecondWin: { $elemMatch: { $regex: number, $options: 'i' } },
  ThirdWin: { $elemMatch: { $regex: number, $options: 'i' } }
});
    return res
      .status(200)
      .json(new ApiResponse(200, results, "Fetched Successfully"));
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

export { addNewList, verifyList, GetList, FindNumber,GetInfo };
