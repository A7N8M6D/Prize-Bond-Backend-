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
  const allForm = req.user._id;  // Assuming req.user._id holds the user's ID
  console.log("User Id:", allForm); // Logging the user ID for debugging

  try {
    const form = await Form.find({ user: allForm });

    if (form.length > 0) {
        // If form is found, return its status
        return res.json({ status: 'created', formStatus: form[0].status }); // Assuming form[0] accesses the first form found
    } else {
        return res.json({ status: 'not created' });
    }
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
                                                         
                                                         
-----------------       All Store        -----------------
                                                        
                                                         
*/

const GetAllForm = asynchandler(async (req, res) => {
  try {
    const { page = 1 } = req.query;  // Default to page 1 if not provided
    const limit = 10;
    const userId = req.user._id;

    console.log("User ID:", userId);

    if (isNaN(page) || page < 1) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid page number"));
    }

    const forms = await Form.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    console.log("Forms:", forms);

    const count = await Form.countDocuments();

    return res.status(200).json(new ApiResponse(200, {
      forms,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10)
    }, "Forms Fetched Successfully"));
  } catch (error) {
    console.error("Error fetching forms:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});


/*
                                                         
                                                         
-----------------       Update Bond        -----------------
                                                        
                                                         
*/

const UpdateForm = asynchandler(async (req, res) => {
  try {
    const { Form_id } = req.query;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const form = await Form.findById(Form_id);

    if (!form) {
      throw new ApiError(400, "Invalid Form");
    }

    form.Status = "true";
    user.userType = "broker"; // Assuming 'user' has a field called 'role'

    await form.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Broker Good Luck!"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
});

/*
                                                         
                                                         
-----------------       Delete Bond        -----------------
                                                        
                                                         
*/
const DeleteForm = asynchandler(async (req, res) => {
  const { Form_id } = req.query;
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
