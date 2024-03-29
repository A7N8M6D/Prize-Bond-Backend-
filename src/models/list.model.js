import mongoose ,{Schema} from "mongoose";
const listschema=new Schema(
    {
        IssueDate:
        {
            type:Date,
            required:true
        },ListSource:
        {
            type:String,
            required:true
        }
    },{
       timestamps:true
    }
)
export const List =mongoose.model("List", listschema);