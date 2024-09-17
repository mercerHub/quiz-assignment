import { Router } from "express";
import { login, refreshTokens, registerUser } from "../controllers/user.controllers.js";

const router = Router();
// register route
router.route("/register").post(registerUser);
// login route
router.route("/login").post(login);
// logout route
//router.route("/logout").get();

// refresh token route

router.route("/refresh-token").post(refreshTokens);
export default router;