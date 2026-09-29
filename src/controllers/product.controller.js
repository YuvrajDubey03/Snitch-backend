import productModel from '../models/product.model.js';
import {uploadImage} from '../services/storage.service.js';


export async function createProduct(req,res){
    console.log(req.body);
    console.log(req.files);
    // updated format of code 
    const fileUrls = await Promise.all(
        req.files.map(async (file) => {
            const response = await uploadImage({
                buffer: file.buffer,
                fileName: file.originalname,
            });
            return response.url;
        })
    );
    // console.log(fileUrls);
    const product = await productModel.create({
        title:req.body.title,
        description:req.body.description,
        price:{
            amount:req.body.price.amount,
            currency:req.body.price.currency
        },sizes:req.body.sizes,
        images:fileUrls,
        seller:req.user.userId
    })
    res.status(201).json({
        message:'product created successfully',
        data:{
            product,
        }
    })
}

export async function listAllProducts(req,res){
    const products = await productModel.find({
        published:true
    });
    res.status(200).json({
        message:'products data fetched successfully',
        data:{
            products
        }
    })
}

export async function listALlProductsToSeller(req,res) {
    const products = await productModel.find()
    return res.status(200).json({
        message: "all products fetched successfully",
        data:{
            products
        }
    })
}





export async function unlistProduct(req,res){
    const {id} =  req.params
    const product  =  await productModel.findById(id)

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }

    
   await productModel.findByIdAndUpdate(id,{
    published:false
   }) 
   return res.status(200).json({
    message:"product unlist successfully"
   })
}

export async function listProduct(req,res){
    const {id} =  req.params
    const product  =  await productModel.findById(id)

    if(!product){
        return res.status(404).json({
            message:"product not found"
        })
    }

    
   await productModel.findByIdAndUpdate(id,{
    published:true
   }) 
   return res.status(200).json({
    message:"product published successfully"
   })
}
