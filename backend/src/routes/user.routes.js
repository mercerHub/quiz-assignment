import { Router } from "express";
import { login, registerUser } from "../controllers/user.controllers.js";

const router = Router();
// register route
router.route("/register").post(registerUser);
// login route
router.route("/login").post(login);
// logout route
//router.route("/logout").get();
export default router;