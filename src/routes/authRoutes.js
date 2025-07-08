import express from 'express'
import { getCurrentUser, login, logout, register } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { User } from '../models/User.js';
const router = express.Router();


router.post('/login' , login);
router.post('/register' , register);
router.post('/logout' , logout);
router.get('/current-user' , verifyToken ,  getCurrentUser);
export default router;