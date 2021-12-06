import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
  googleLogin,
  sendTestEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);

// social
router.post("/google_login", googleLogin);

router.get("/send_email", sendTestEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
