import mongoose, { Schema } from "mongoose";
const storeschema = new Schema(
  {
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Description: {
      type: String,
      required: true,
    },
    City: {
      type: String,
    },Area: {
      type: String,
    },
    number: {
      type: String,
    },
    Email: {
      type: String,
    },
    Name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
export const Store = mongoose.model("Store", storeschema);
