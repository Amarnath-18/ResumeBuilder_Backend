import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {createResume, getResume, getResumeById, getPublicResumeById, deleteResume} from '../controllers/resumeController.js'
const router = express.Router();

router.post("/create", verifyToken,createResume );
router.get('/get-resumeOfUser' , verifyToken , getResume);
router.get('/get-resume/:resumeId' , verifyToken , getResumeById );
router.get('/public/:resumeId' , getPublicResumeById ); // Public route without authentication
router.delete('/:resumeId' , verifyToken , deleteResume);
export default router;