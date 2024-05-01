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
       default:false
    },
    BuyYear:{
      type:String
    },
    Buymonths:{
      type:String
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