import {Router} from 'express';
import {checkSolution, getQuestions} from '../controllers/question.controllers.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = Router();

router.route("/getQuestions").get(verifyJWT,getQuestions);
router.route("/checkSolution").post(verifyJWT,checkSolution);

export default router;