import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addNewList } from "../controllers/List.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const router=Router();

router.route("/add").post(  upload.fields([
    {
        name: "List",
        maxCount: 1
    }] ) ,addNewList);

export default router