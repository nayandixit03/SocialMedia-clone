import  express from 'express';
import { loginUser, registerUser } from '../Controllers/AuthController.js';

const router=express.Router();


//to post the route to the server
router.post('/register',registerUser);
router.post('/login',loginUser);

export default router