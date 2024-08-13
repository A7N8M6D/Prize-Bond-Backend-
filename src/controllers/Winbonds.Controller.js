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
  
    // const { BondType } = req.query;
  console.log("first");
  const allbonds = req.user._id;
  console.log("user ID", allbonds)
  console.log("Second");
  const bonds = await BondWin.findById(allbonds);
  console.log("all bond",bonds)
  console.log("bonds", bonds);
  return res
    .status(200)
    .json(new ApiResponse(200, bonds, "User Fetched Succesfully"));
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
