import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { DeleteBond, GetAllBond, UpdateBond, addNewBond } from "../controllers/bond.controller.js";
const router=Router();

router.route("/add").post(verifyJWT  , addNewBond);
router.route("/allBond").get(verifyJWT  , GetAllBond);
router.route("/updateBond").post(verifyJWT  , UpdateBond);
router.route("/deleteBond").delete(verifyJWT  , DeleteBond);
export default router