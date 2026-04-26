import express from "express";
import {
  signup,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuth, getCurrentUser);

export default router;
