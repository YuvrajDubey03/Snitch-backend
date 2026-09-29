import {body,validationResult} from 'express-validator';

export const addToCartValidator = [
    body("productId")
        .exists().withMessage("productId is required").bail()
        .isString().withMessage("productId must be string").bail()
        .isMongoId().withMessage("productId must be a valid mongoId").bail(),
    body("quantity")
        .exists().withMessage("quantity is required").bail()
        .isInt({ min: 1 }).withMessage("quantity must be a number grater than 0").bail(),
    body("size")
        .exists().withMessage("size is required").bail()
        .isString().withMessage("size must be a string").bail()
        .isIn(['XS','S','M','L','XL','XXL']).withMessage("size must be one of the following sizes  XS, S,M,L,XL,XXL").bail(),
      
        (req,res,next)=>{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    message: "Validation failed.",
                    errors: errors.array() });
            }
            next();
        }



]