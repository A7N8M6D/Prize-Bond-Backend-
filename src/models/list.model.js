import mongoose, { Schema } from "mongoose";
const listschema = new Schema(
  {
    Date: {
      type: Number,
      required: true,
    },
    Month: {
      type: Number,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },
    PrizeBondAmount: {
      type: String,
      require: true,
    },
    FirstWin: {
      type: [String],
      require: true,
    },
    FirstPrize: {
      type: String,
      require: true,
    },
    SecondWin: {
      type: [String],
      require: true,
    },
    SecondPrize: {
      type: String,
      require: true,
    },
    ThirdWin: {
      type: [String],
      require: true,
    },
    ThirdPrize: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
export const List = mongoose.model("List", listschema);
