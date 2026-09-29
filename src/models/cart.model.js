import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    product:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
            },quantity:{
                type:Number,
                default:1,
                min:1,
            },size:{
                type:String,
                enum:["XS","S","M","L","XL","XXL"],
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    }
});

const cartModel = mongoose.model("cart",cartSchema);

export default cartModel;