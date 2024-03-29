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
      required: true,
    },
    user: {
      type: Schema.ObjectId.type,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export const Form = mongoose.model("Form", formschema);
