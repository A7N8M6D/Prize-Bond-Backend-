import { Bond } from "../models/bonds.model.js";
import { Form } from "../models/form.model.js";
import { Store } from "../models/store.mdel.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

/*
 
 
-----------------        Request Form        -----------------


*/
//Experience,Description,Status
const addForm = asynchandler(async (req, res) => {
  const { Experience, Description } = req.body;

  const useR = await Form.findById(req.user?._id);
  if ([Description, Experience].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "fields are required");
  }

  // const existedStore = await Store.findById({
  //   req.user?._id
  // });
  // console.log("user of bond" + useR._id);
  // if (existedStore) {
  //   throw new ApiError(409, "Store already Exist");
  // }

  const createdForm = await Form.create({
    Description,
    Experience,
    user: req.user?._id,
  });
  if (!createdForm) {
    throw new ApiError(500, "Form not Save Something went wrong");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdForm, "Form Creted Successfully"));
});

/*
                                                         
                                                         
-----------------       Personal Store        -----------------
                                                        
                                                         
*/
const GetForm = asynchandler(async (req, res) => {
  const allForm = req.user._id;
  const Form = await Form.find({ user: allForm });

  return res
    .status(200)
    .json(new ApiResponse(200, Form, "Store Fetched Succesfully"));
});
/*
                                                         
                                                         
-----------------       Check Form        -----------------
                                                        
                                                         
*/
const CheckForm = asynchandler(async (req, res) => {
  const allForm = req.user._id;
  try {
    const form = await Form.findById(allForm);
    if (form) {
        // If form is found, return its status
        return res.json({ status: 'created', formStatus: form.status });
    } else {
        return res.json({ status: 'not created' });
    }
} catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
}
});
/*
                                                         
                                                         
-----------------       All Store        -----------------
                                                        
                                                         
*/

const GetAllForm = asynchandler(async (req, res) => {
  const allForm = req.user._id;
  const form = await Form.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, form, "Form Fetched Succesfully"));
});
/*
                                                         
                                                         
-----------------       Update Bond        -----------------
                                                        
                                                         
*/

const UpdateForm = asynchandler(async (req, res) => {
  const { status, typeUser } = req.body;
  const user = req.req.user._id;

  const form = await Form.findById(store_id);
  if (!form) {
    throw new ApiError(400, "Invalid Form");
  }
  form.Status = "true";

  await Form.save({ validateBeforeSave: false });
  user.userTyoe = "broker";

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, " Broker Good Luck!"));
});
/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
const DeleteForm = asynchandler(async (req, res) => {
  const { Form_id } = req.body;
  const deletedForm = await Form.findByIdAndDelete(Form_id);

  // Check if the bond exists
  if (!deletedForm) {
    throw new ApiError(400, " Form Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Form Delete Successfully"));
});
export { addForm, CheckForm,GetForm, UpdateForm, DeleteForm, GetAllForm };
