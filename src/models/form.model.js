import mongoose, { Schema } from "mongoose";
const formschema = new Schema(
  {
    Experience: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Status: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export const Form = mongoose.model("Form", formschema);
