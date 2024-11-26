import mongoose, { Mongoose } from "mongoose";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact : {
        type : String,
        required : true,
    },
    tags: {
        type: [String],
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    relatedQueries : [
        {
        query :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Query",
        },
        chat : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Chat",
        }
        }
    ],
}, { timestamps: true });

export default mongoose.model("User", userModel);