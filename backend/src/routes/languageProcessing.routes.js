import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import { uploadAudio } from "../controllers/languageProcessing.controllers.js";

const router = Router();

router.route("/upload").post(upload.single('file'),uploadAudio);

export default router;