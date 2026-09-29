import { Router } from 'express';
import {registerValidator,loginValidator} from '../validator/auth.validator.js';
import {registerUser,loginUser,refresh,getMe} from '../controllers/auth.controller.js';
import {authenticate} from '../middlewares/auth.middleware.js';


const router = Router();

// @post /api/auth/register
// @ params req express request
// @params  req.body ={email,name,password}
// @response res.status(201) if success
router.post('/register',registerValidator,registerUser);

// post /api/auth/login
// @params req
// params req.body ={email,password}
// res.status = 200

router.post('/login',loginValidator,loginUser);


// @post /api/auth/refresf tokens

router.post('/refresh',refresh)

// @get /api/auth/me

router.get('/me',authenticate,getMe)

export default router