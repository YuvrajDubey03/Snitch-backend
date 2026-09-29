import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';


export async function addToCart(req,res){

    const {productId,quantity,size} = req.body;
    const product = await productModel.findById(req.body.productId);
    if(!product){
        return res.status(404).json({message:"product not found"});
    }
     const SelectedSize = product.sizes.find(s => s.size === size);
     if(!SelectedSize){
         return res.status(400).json({message:"size not found"});
     }
     if(SelectedSize.stock < quantity){
         return res.status(400).json({message:"not enough stock"});
     }
    //  let cart = await cartModel.findOne({userId:req.user.userId});
    //  if(!cart){
    //      cart = await cartModel.create({userId:req.user.userId});
    //  }

    // find cart and if not found create one
    const cart = await cartModel.findOne({user:req.user.userId}) ?? await cartModel.create({user:req.user.userId});

    const productInCart = cart.product.find(p => p.product.toString() === productId);
    if(productInCart)
        {
            if((productInCart.quantity + quantity )>SelectedSize.stock){
            return res.status(400).json({message:"not enough stock"});
             }
         await cartModel.updateOne(
            {
                user:req.user.userId,
                "product.product":productId,
                "product.size":size
            },{
                $inc:{
                    "product.$.quantity":quantity
                }
            }
         )
         return res.status(200).json({message:"product qauntity updated"});
         }

    await cartModel.findOneAndUpdate(
        {user:req.user.userId},
        {$push:{
            products:{
                product:productId,
                quantity:quantity,
                size:size
            }
        }}
    )
    return res.status(200).json({message:"product added to cart"});
}


export async function getCart(req,res){
    const cart = (await cartModel.findOne({user:req.user.userId})) ??
    (await cartModel.create({user:req.user.userId}));

    return res.status(200).json({
        message:"cart fetched",
        data:{
            cart:cart
        }
    });
};
