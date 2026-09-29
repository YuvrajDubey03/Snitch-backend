import { body, param, validationResult } from 'express-validator';

  export const createProductValidator = [
        body('title')
             .exists().withMessage('Title is required').bail()
             .isString().withMessage('Title must be a string').bail()
             .trim()
             .isLength({min:2,max:100}).withMessage('Title must be between 2 to 100 characters')
             .isAlpha('en-US',{ignore:' -'}).withMessage('Title must be alphabets'),
        body("description")
             .exists().withMessage('Description is required').bail()
             .isString().withMessage('Description must be a string').bail()
             .trim()
             .isLength({min:20,max:500}).withMessage('Description must be between 20 to 500 characters'),    
        body('price.amount')
            .exists().withMessage('Amount is required').bail()
            .isFloat({min:0}).withMessage('Amount must be a floating number and must be greater than 0').bail(),
       body('price.currency')
            .exists().withMessage('Currency is required').bail()
            .isString().withMessage('Currency must be a string').bail()
            .isIn(['USD','INR']).withMessage('Currency must be either USD or INR'),
       body("sizes")
            .exists().withMessage("sizes must be required").bail()
            .isArray().withMessage("sizes must be an array of objects"),
      body("sizes.*.size")
           .exists().withMessage("size must be present in every entry  in sizes array").bail()
           .isString().withMessage("size must be a string").bail()
           .trim()
           .isIn(['XS','S','M','L','XL','XXL']).withMessage("size must be one of the following XS,S,M,L,XL,XXL"),
     body("sizes.*.stock")
           .exists().withMessage("stock must be present in every entry  in sizes array").bail()
           .isInt({min:0}).withMessage("stock must be an integer and must be greater than 0").bail(),
     (req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
     }
            


        
  ]


export const unlistProductValidator=[
     param('id')
            .exists().withMessage("product id is required").bail()
            .isMongoId().withMessage("product is muts have a valid mongo object id "),
          (req,res,next)=>{
               const errors = validationResult(req)
               if(!errors.isEmpty() ){
                     return res.status(400).json({
                         message:"invalid data",
                         errors:errors.array()
                     })
               }
               next()
          }  
          
]

export const listProductValidator=[
     param('id')
            .exists().withMessage("product id is required").bail()
            .isMongoId().withMessage("product is muts have a valid mongo object id "),
          (req,res,next)=>{
               const errors = validationResult(req)
               if(!errors.isEmpty() ){
                     return res.status(400).json({
                         message:"invalid data",
                         errors:errors.array()
                     })
               }
               next()
          }  
          
]