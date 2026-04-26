import express from "express";
import {
  placeBid,
  getBidsForRFQ,
  getMyBids,
  getWinningBid,
  deleteBid,
} from "../controllers/bid.controller.js";
import isAuth from "../middlewares/isAuth.js";
import checkRole from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/place", isAuth, checkRole(["supplier"]), placeBid);
router.get("/:rfqId", getBidsForRFQ);
router.get("/my-bids/all", isAuth, checkRole(["supplier"]), getMyBids);
router.get("/winning/:rfqId", getWinningBid);
router.delete("/:bidId", isAuth, checkRole(["supplier"]), deleteBid);

export default router;
