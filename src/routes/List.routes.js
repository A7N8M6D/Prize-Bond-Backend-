import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { FindNumber, GetList, addNewList } from "../controllers/List.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { GetForm } from "../controllers/Form.controller.js";
const router=Router();

router.route("/add").post(  upload.fields([
    {
        
        name: "List",
        maxCount: 1
    }] ) ,addNewList);
router.route("/getList").get(GetList);
router.route("/FindNumber").get(FindNumber);
export default router