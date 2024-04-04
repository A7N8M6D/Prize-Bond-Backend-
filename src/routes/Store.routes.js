import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { DeleteBond, GetAllBond, UpdateBond, addNewBond } from "../controllers/bond.controller.js";
import { DeleteStore, GetAllStore, GetStore, UpdateStore, addStore } from "../controllers/Store.controller.js";
const router=Router();

router.route("/add").post(verifyJWT  , addStore);
router.route("/delete").delete(verifyJWT  , DeleteStore);
router.route("/update").post(verifyJWT  , UpdateStore);
router.route("/getStore").get(verifyJWT  , GetStore);
router.route("/getAllStore").get( GetAllStore);
export default router