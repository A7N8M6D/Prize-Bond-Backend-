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
  // const { file ,Date, Month, Year, PrizeBondAmount, FirstWinWithCommas, FirstPrize, SeecondWinWithCommas, SecondPrize, ThirdWinWithCommas, ThirdPrize } = req.body;
  //   console.log(file);
  //   const numberFields = [
  //     Date,
  //     Year,
  //     PrizeBondAmount,
  //     FirstPrize,
  //     SecondPrize,
  //     ThirdPrize
  //   ];

  //         if (typeof Month !== "string") {
  //           return res.status(400).json({ error: "Month must be a string" });
  //         }

  //   console.log("sadsad", FirstWinWithCommas, SeecondWinWithCommas, ThirdWinWithCommas);
  //   if (!FirstWinWithCommas || !SeecondWinWithCommas || !ThirdWinWithCommas) {
  //     return res.status(400).json({ error: "FirstWinWithCommas, SeecondWinWithCommas, and ThirdWinWithCommas are required" });
  //   }

  //   const FirstWin = FirstWinWithCommas.replace(/\s+/g, ",");
  //   const SecondWin = SeecondWinWithCommas.replace(/\s+/g, ",");
  //   const ThirdWin = ThirdWinWithCommas.replace(/\s+/g, ",");
  //   const splitFirstWin = FirstWin.split(',').map(num => parseInt(num.trim()));
  //   const splitSecondWin = SecondWin.split(',').map(num => parseInt(num.trim()));
  //   const splitThirdWin = ThirdWin.split(',').map(num => parseInt(num.trim()));
  //   parseInt(splitFirstWin)
  //   console.log("sadsad", splitFirstWin);
  //   const createdbond = await List.create({
  //     Date: parseInt(Date),
  //     Month,
  //     Year: parseInt(Year),
  //     PrizeBondAmount: parseInt(PrizeBondAmount),
  //     FirstWin: splitFirstWin,
  //     FirstPrize: parseInt(FirstPrize),
  //     SecondWin: splitSecondWin,
  //     SecondPrize: parseInt(SecondPrize),
  //     ThirdWin:splitThirdWin,
  //     ThirdPrize: parseInt(ThirdPrize)
  // });

  //   if (!createdbond) {
  //     throw new ApiError(500, "List not saved. Something went wrong");
  //   }
  // return res.status(201).json(new ApiResponse(200, createdbond, "List saved successfully"));
  console.log("File ", req.files?.List[0]);
  const avatarLocalPath = req.files?.List[0]?.path;

  fs.readFile(avatarLocalPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }

    // Log the file contents
    console.log("File contents:", data);

    // Extract prize amount from the file contents
    const prizeAmountRegex = /DRAW OF Rs\.(\d+)/;
    const prizeAmountMatch = data.match(prizeAmountRegex);
    console.log("prizeAmountMatch", prizeAmountMatch);
    if (prizeAmountMatch) {
      const prizeAmount = prizeAmountMatch[1];
      console.log("Prize amount:", prizeAmount);
    } else {
      console.log("Prize amount not found");
    }

    // Extract date and month from the file contents
    const dateRegex = /Date:(\d{2})\/(\d{2})\/(\d{4})/;
    const dateMatch = data.match(dateRegex);
    if (dateMatch) {
      const day = dateMatch[1];
      const month = dateMatch[2];
      const year = dateMatch[3];
      console.log("Date:", day);
      console.log("Month:", month);
      console.log("Year:", year);
    } else {
      console.log("Date not found");
    }
    //Extract First Prize
    const firstPrizeRegex = /First Prize of Rs\.(\d{1,3}(,\d{3})*)/;
    const firstPrizeMatch = data.match(firstPrizeRegex);
    if (firstPrizeMatch) {
      const firstPrizeAmount = firstPrizeMatch[1];
      console.log("First Prize amount:", firstPrizeAmount);
    } else {
      console.log("First Prize amount not found");
    }

    // Extract second prize details from the file contents
    const secondPrizeRegex = /Second Prize of Rs\.Rs\.(\d{1,3}(,\d{3})*)/;
    const secondPrizeMatch = data.match(secondPrizeRegex);
    if (secondPrizeMatch) {
      const secondPrizeAmount = secondPrizeMatch[1];
      console.log("Second Prize amount:", secondPrizeAmount);
    } else {
      console.log("Second Prize amount not found");
    }
    // Extract Third prize details from the file contents
    const ThirdPrizeRegex = /1696 Prize\(s\) of (\d{1,3}(,\d{3})*)/;

    const ThirdPrizeMatch = data.match(ThirdPrizeRegex);
    if (ThirdPrizeMatch) {
      const ThirdPrizeAmount = ThirdPrizeMatch[1];
      console.log("Second Prize amount:", ThirdPrizeAmount);
    } else {
      console.log("Second Prize amount not found");
    }

    const FirstPrizeNumberRegex = /Second Prize of Rs\.Rs\.\d+\/-\s*([\d\s]+)/;
    const FirstPrizeMatch = data.match(FirstPrizeNumberRegex);
    if (FirstPrizeMatch) {
      const FirstPrizeAmount = FirstPrizeMatch[1];
      console.log("First Prize amount:", FirstPrizeAmount);
    } else {
      console.log("FirstPrize amount not found");
    }
    function extractFirstPrizeNumber(input, SplitedString, lineNumber) {
      // Split the input string by the specified split string
      let parts = input.split(SplitedString);

      console.log("step1", parts);

      // Check if there is a part after the specified split string
      if (parts.length > 1) {
        // Get the text after the specified split string
        let afterPrize = parts[1].trim();
        console.log("step2 ", afterPrize);
        if(SplitedString=="DRAW OF Rs.")
          {
            const newPrize=afterPrize.split("/-")
            console.log("new",newPrize)
            const Prize=newPrize[0]
            return Prize
            console.log("Prize",Prize)
          }
        if (SplitedString == "Date") {
          let regex = /(\d{2})\/(\d{2})\/(\d{4})/;

          // Extract the date and month
          let match = afterPrize.match(regex);
          console.log("matcg", match);
          if (match) {
            // match[1] is the day, match[2] is the month
            let day = match[1];
            let month = match[2];
            return { day, month };
            // console.log("Day:", day);
            console.log("Month:", month);
          } else {
            console.log("Invalid date format");
            return "no";
          }
        }
        // Special handling for "1696 Prize(s) of"
        if (SplitedString == "First Prize of" || SplitedString == "Second Prize of"||SplitedString=="1696 Prize") {
          // Regular expression to match all six-digit numbers
          let regex = /\b\d{6}\b/g;
          console.log("Special handling regex: ", regex);
          if(SplitedString=="First Prize of")
            {
            afterPrize=afterPrize.split("Second Prize of")
            }
            if(SplitedString=="Second Prize of")
              {
              afterPrize=afterPrize.split("1696 Prize")
              }
              if(SplitedString=="1696 Prize")
                {
                afterPrize=afterPrize.split("1696 Prize")
                }
            afterPrize=afterPrize[0];
          // Extract the numbers
          let matches = afterPrize.match(regex);
          console.log("Special handling matches: ", matches);

          return matches || [];
        } 
      }

      return [];
    }

    // Extract the first prize number
    let firstPrizeNumber = extractFirstPrizeNumber(data, "First Prize of", 2);

    // Extract the second prize numbers
    let secondPrizeNumbers = extractFirstPrizeNumber(
      data,
      "Second Prize of",
      2
    );

    // Extract all prize numbers after the "1696 Prize(s) of" line
    let allPrizeNumbers = extractFirstPrizeNumber(data, "1696 Prize", 0);
    console.log("alll", firstPrizeNumber);
    console.log("alll", secondPrizeNumbers);
    console.log("alll", allPrizeNumbers);
   
    const DATE = extractFirstPrizeNumber(data, "Date", 1);
    const PrizeBond=extractFirstPrizeNumber(data,"DRAW OF Rs." )
    console.log("Prize",PrizeBond)
    console.log("DATE", DATE);
    if (firstPrizeNumber) {
      console.log("First Prize Number:", firstPrizeNumber);
    } else {
      console.log("First Prize Number not found.");
    }

    if (secondPrizeNumbers.length > 0) {
      console.log("Second Prize Numbers:", secondPrizeNumbers.join(", "));
    } else {
      console.log("Second Prize Numbers not found.");
    }

    if (allPrizeNumbers.length > 0) {
      console.log("All Prize Numbers:", allPrizeNumbers.join(", "));
    } else {
      console.log("All Prize Numbers not found.");
    }
  });
  return res.status(201).json(new ApiResponse(200, "List saved successfully"));
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
