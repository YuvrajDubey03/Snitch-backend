import { Router } from 'express';
import {authenticate,authenticateSeller} from '../middlewares/auth.middleware.js';
import {createProductValidator,unlistProductValidator,listProductValidator} from '../validator/product.validator.js';
import { createProduct ,listAllProducts,unlistProduct ,listProduct, listALlProductsToSeller} from '../controllers/product.controller.js';
import multer from 'multer'
const router = Router();

const upload = multer(
    {storage :multer.memoryStorage(),
     limits:{
        files:5,
         fileSize:1024*1024*1  //1MB
     }   
    //  file filter  to accept files or specific file types images ,audio,video e.t.c


});

// @method post
// @route /api/products
// @description create a new product and save its data in to db , imaeges will be stored in imagekit

router.post("/",authenticate,authenticateSeller,upload.array('images'),(req,res,next)=>{
   req.body?.price && (req.body.price =JSON.parse(req.body.price));
   req.body?.sizes && (req.body.sizes =JSON.parse(req.body.sizes));
    next();
},createProductValidator,createProduct);


// @method get
/* @route /api/products
@description read all products from db
@access user   */

router.get("/",authenticate,listAllProducts);


/* 
 @method get
 @description read all the products from db 
 @access Seller
*/

router.get('/seller',authenticate,authenticateSeller,listALlProductsToSeller)


/* 
@method patch
@route /api/products/unlist/:id
@description unlist product by id
@access seller
*/

router.patch('/unlist/:id',authenticate,authenticateSeller,unlistProductValidator,unlistProduct)


/* 
@method patch
@route /api/products/unlist/:id
@description published product by id
@access seller
*/

router.patch('/list/:id',authenticate,authenticateSeller,listProductValidator,listProduct)


export default router;  