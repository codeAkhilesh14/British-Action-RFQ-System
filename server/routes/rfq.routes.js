import express from "express";
import {
  createRFQ,
  getAllRFQs,
  getRFQById,
  updateRFQ,
  deleteRFQ,
  getMyRFQs,
} from "../controllers/rfq.controller.js";
import isAuth from "../middlewares/isAuth.js";
import checkRole from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/create", isAuth, checkRole(["buyer"]), createRFQ);
router.get("/all", getAllRFQs);
router.get("/my-rfqs", isAuth, checkRole(["buyer"]), getMyRFQs);
router.get("/:id", getRFQById);
router.put("/:id", isAuth, checkRole(["buyer"]), updateRFQ);
router.delete("/:id", isAuth, checkRole(["buyer"]), deleteRFQ);

export default router;
