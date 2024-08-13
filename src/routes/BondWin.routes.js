import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { DeleteBond, GetAllBond, UpdateBond, addNewBond } from "../controllers/bond.controller.js";
import { DeleteWinBond, GetAllWinBond } from "../controllers/Winbonds.Controller.js";
const router=Router();

router.route("/allWinbond").get(verifyJWT  , GetAllWinBond);
router.route("/deleteWinbond").delete(verifyJWT  , DeleteWinBond);
export default router