import mongoose, { Schema } from "mongoose";
const storeschema = new Schema(
  {
    User: {
      type: Schema.ObjectId.type,
      ref: "User",
    },
    Description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Store=mongoose.model("Store", storeschema);