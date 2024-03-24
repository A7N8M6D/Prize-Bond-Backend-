import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const Schema = mongoose.Schema;

const bondSchema = new Schema({
    number: {
        type: String,
        required: true
    },
    winningAmount: {
        type: Number,
        required: true
    },
    win:{
        type:Boolean,
    }
});
bondSchema.plugin(mongooseAggregatePaginate)
module.exports = mongoose.model('UserBond', bondSchema);
