import {Router} from 'express';
import {getQuestions} from '../controllers/question.controllers.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = Router();

router.route("/getQuestions").get(verifyJWT,getQuestions);

export default router;