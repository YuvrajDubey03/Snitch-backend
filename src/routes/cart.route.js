import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addToCartValidator } from "../validator/cart.validator.js";
import { addToCart } from "../controllers/cart.controller.js";
const router = Router();
/* 
@method post
@route /api/cart
@desc add product to cart
@access protected
*/

router.post("/",authenticate,addToCartValidator,addToCart);

/* 
@method get
@route /api/cart
@desc get the usercart
@access protected
 */
 router.get("/",authenticate)

export default router;