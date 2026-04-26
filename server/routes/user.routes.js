import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/profile", isAuth, getUserProfile);
router.put("/profile", isAuth, updateUserProfile);

export default router;
