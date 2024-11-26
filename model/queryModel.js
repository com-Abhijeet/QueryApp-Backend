import mongoose from "mongoose";

const queryModel = new mongoose.Schema({
    query: {
        type: String,
        required: true  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status : {
        type : String,
        default : "Active",
    },
    keywords :{
        type : [String],
    },
    imageUrl : {
        type : String,

    },
}, { timestamps: true });

export default mongoose.model("Query", queryModel);