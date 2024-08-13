import { BondWin } from "../models/Winbonds.model.js";
import { Bond } from "../models/bonds.model.js";
import { List } from "../models/list.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";



/*
                                                         
                                                         
-----------------       All Win Bonds        -----------------
                                                        
                                                         
*/

const GetAllWinBond = asynchandler(async (req, res) => {
    try {
      const userId = req.user._id;
      console.log("User ID:", userId);
  
      // Find all winning bonds for the user
      const bonds = await BondWin.find({ user: userId });
  
      if (!bonds || bonds.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "No winning bonds found for the user"));
      }
  
      console.log("Winning Bonds:", bonds);
  
      return res
        .status(200)
        .json(new ApiResponse(200, bonds, "Winning bonds fetched successfully"));
    } catch (error) {
      console.error("Error fetching winning bonds:", error);
      return res
        .status(500)
        .json(new ApiResponse(500, null, "An error occurred while fetching winning bonds"));
    }
  });
  

/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
const DeleteWinBond = asynchandler(async (req, res) => {
    const { BondWin_id } = req.query;
    const deletedForm = await BondWin.findByIdAndDelete(BondWin_id);
  
    // Check if the bond exists
    if (!deletedForm) {
      throw new ApiError(400, " Form Not Found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Form Delete Successfully"));
  });


export {  GetAllWinBond,  DeleteWinBond };
