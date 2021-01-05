import AuthenticationController from "~/controllers/authentication.js";
import authMiddleware from "~/middlewares/auth";
import express from "express";

let router = express.Router();

router.post("/login", AuthenticationController.login);
router.post("/login/google", AuthenticationController.loginGoogle);
router.post("/logout", authMiddleware, AuthenticationController.logout);
router.post("/register", AuthenticationController.register);
router.post("/forgotPassword", AuthenticationController.forgotPassword);
router.post("/token", AuthenticationController.refreshToken);

export default router;
