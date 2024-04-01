import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { DeleteBond, GetAllBond, UpdateBond, addNewBond } from "../controllers/bond.controller.js";
import { DeleteStore, GetAllStore, GetStore, UpdateStore, addStore } from "../controllers/Store.controller.js";
import { DeleteForm, GetAllForm, GetForm, UpdateForm, addForm } from "../controllers/Form.controller.js";
const router=Router();

router.route("/add").post(verifyJWT  , addForm);
router.route("/delete").delete(verifyJWT  , DeleteForm);
router.route("/update").post(verifyJWT  , UpdateForm);
router.route("/getForm").delete(verifyJWT  , GetForm);
router.route("/getAllForm").get(verifyJWT  , GetAllForm);
export default router