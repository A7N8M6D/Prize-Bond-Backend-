import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { DeleteList, FindNumber, GetInfo, GetList, addNewList } from "../controllers/List.controller.js";
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
router.route("/FindInfo").get(GetInfo);
router.route("/Delete").delete(DeleteList);

export default router