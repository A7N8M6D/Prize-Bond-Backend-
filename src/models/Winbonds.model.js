import mongoose, { Schema } from "mongoose";
const bondsWinschema = new Schema(
  {
    PrizeBondType: {
      type: Number,
      required: true,
    },
    PrizeBondNumber: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bond:{
      type:Schema.Types.ObjectId,
      ref:"Bond"
    },
    List:{
      type:Schema.Types.ObjectId,
      ref:"List"
    },
     Month: {
      type: Number,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },
    AmountWin: {
      type: String,
      require: true,
    },
    WinPosition: {
      type: [String],
      require: true,
    }
  },
  {
    timestamps: true,
  }
);
export const BondWin = mongoose.model("BondWin", bondsWinschema);
