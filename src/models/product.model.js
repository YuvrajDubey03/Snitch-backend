import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength:2,
        maxLength:100
         },
    price:{
        amount:{
            type:Number,
            required:true,
               },
        currency:{
            type:String,
            enum:['USD','INR'],
            default:'INR'
                 }
         },
    description:{
        type:String,
        required:true,
        minLength:20,
        maxLength:500
                },
    images:{
              type:[{
                     type:String,
                     required:true
                   }],
              validate:{
                         validator : images =>images.length<=5,
                          message:'a product can have maximum 5 images'
                        }
             },

     sizes: [
        {
                size:{
                       type:String,
                       enum:['XS','S','M','L','XL','XXL'],
                       required:true
                     },
                stock:{
                        type:Number,
                        min:0,
                        default:0
                     }
        }
           ],

    seller :{
                type:mongoose.Schema.Types.ObjectId,
                ref:'users',
                required:true
            },
    published:{
        type:Boolean,
        default:false
    }        
})

const productModel = mongoose.model('products',productSchema);

export default productModel;