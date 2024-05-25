import mongoose, { Schema } from "mongoose";
const bondschema = new Schema(
  {
    PrizeBondType: {
      type: Number,
      required: true,
    },
    PrizeBondNumber: {
      type: [String],
      required: true,
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
export const Bond = mongoose.model("Bond", bondschema);
