import mongoose, { Schema } from "mongoose";
const bondschema = new Schema(
  {
    PrizeBondType: {
      type: Number,
      required: true,
    },
    PrizeBondNumber: {
      type: Number,
      required: true,
    },
    win: {
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
export const Bond = mongoose.model("Bond", bondschema);
