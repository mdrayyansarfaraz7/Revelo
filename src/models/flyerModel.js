import mongoose from "mongoose";

const flyerSchema = new mongoose.Schema({
    imgUrl:{
        type: String,
        required: true ,
        unique:true
    },
    description:{
        type: String,
        required: true
    },
    enentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    }
});

const Flyer = mongoose.models.Flyer || mongoose.model("Flyer", flyerSchema);
export default Flyer;
