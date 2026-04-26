import Bid from "../models/Bid.js";
import RFQ from "../models/RFQ.js";
import asyncHandler from "../utils/asyncHandler.js";

// Place a bid (British Auction - each bid must be lower than previous)
export const placeBid = asyncHandler(async (req, res) => {
  const { rfqId, bidAmount, message } = req.body;

  // Validation
  if (!rfqId || bidAmount === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide rfqId and bidAmount",
    });
  }

  // Find RFQ
  const rfq = await RFQ.findById(rfqId);

  if (!rfq) {
    return res.status(404).json({
      success: false,
      message: "RFQ not found",
    });
  }

  // Check if RFQ is active
  const now = new Date();
  if (now < rfq.startTime || now > rfq.forcedEndTime) {
    return res.status(400).json({
      success: false,
      message: "RFQ is not active for bidding",
    });
  }

  // British Auction Logic: Each bid must be lower than the current lowest bid
  if (rfq.currentLowestBid !== null && bidAmount >= rfq.currentLowestBid) {
    return res.status(400).json({
      success: false,
      message: `Bid amount must be lower than current lowest bid of ${rfq.currentLowestBid}`,
    });
  }

  // Check if user is the buyer (cannot bid on own RFQ)
  if (rfq.buyerId.toString() === req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You cannot bid on your own RFQ",
    });
  }

  // Check if user has already placed a bid on this RFQ
  const existingBid = await Bid.findOne({
    rfqId,
    bidderId: req.user._id,
    status: "active",
  });

  // If bid exists, mark it as outbid and update the latest one
  if (existingBid) {
    existingBid.status = "outbid";
    await existingBid.save();
  }

  // Create new bid
  const bid = await Bid.create({
    rfqId,
    bidderId: req.user._id,
    bidAmount,
    message: message || "",
    isWinning: true,
    status: "active",
  });

  // Update RFQ with new lowest bid
  rfq.currentLowestBid = bidAmount;
  rfq.currentLowestBidderId = req.user._id;
  rfq.bidsCount = (rfq.bidsCount || 0) + 1;

  // Auto-extend auction if bid is near end time (within 5 minutes)
  const timeUntilEnd = rfq.endTime.getTime() - now.getTime();
  if (timeUntilEnd < rfq.autoExtendTime) {
    const newEndTime = new Date(now.getTime() + rfq.autoExtendTime);
    rfq.endTime = newEndTime;
  }

  // Mark all previous bids as outbid for this RFQ
  await Bid.updateMany(
    { rfqId, bidderId: { $ne: req.user._id }, status: "active" },
    { status: "outbid", isWinning: false }
  );

  await rfq.save();

  const populatedBid = await bid.populate(
    "bidderId",
    "name email company"
  );

  res.status(201).json({
    success: true,
    message: "Bid placed successfully",
    bid: populatedBid,
    rfq: {
      id: rfq._id,
      currentLowestBid: rfq.currentLowestBid,
      endTime: rfq.endTime,
    },
  });
});

// Get bids for an RFQ
export const getBidsForRFQ = asyncHandler(async (req, res) => {
  const { rfqId } = req.params;

  const bids = await Bid.find({ rfqId })
    .populate("bidderId", "name email company phone")
    .sort({ bidTime: -1 });

  if (bids.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No bids found",
      bids: [],
    });
  }

  res.status(200).json({
    success: true,
    count: bids.length,
    bids,
  });
});

// Get my bids
export const getMyBids = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ bidderId: req.user._id })
    .populate("rfqId", "title description currentLowestBid status")
    .sort({ bidTime: -1 });

  res.status(200).json({
    success: true,
    count: bids.length,
    bids,
  });
});

// Get winning bid for an RFQ
export const getWinningBid = asyncHandler(async (req, res) => {
  const { rfqId } = req.params;

  const rfq = await RFQ.findById(rfqId);

  if (!rfq) {
    return res.status(404).json({
      success: false,
      message: "RFQ not found",
    });
  }

  // Check if RFQ has ended
  const now = new Date();
  if (now < rfq.forcedEndTime) {
    return res.status(400).json({
      success: false,
      message: "RFQ is still active, no winner yet",
    });
  }

  const winningBid = await Bid.findOne({ rfqId, isWinning: true })
    .populate("bidderId", "name email company phone")
    .populate("rfqId");

  if (!winningBid) {
    return res.status(404).json({
      success: false,
      message: "No winning bid found",
    });
  }

  res.status(200).json({
    success: true,
    winningBid,
  });
});

// Delete a bid
export const deleteBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;

  const bid = await Bid.findById(bidId);

  if (!bid) {
    return res.status(404).json({
      success: false,
      message: "Bid not found",
    });
  }

  // Check if user is the bidder
  if (bid.bidderId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own bids",
    });
  }

  // Check if bid can be deleted (only if RFQ is still pending)
  const rfq = await RFQ.findById(bid.rfqId);
  if (rfq.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Cannot delete bid for an active or ended RFQ",
    });
  }

  await Bid.findByIdAndDelete(bidId);

  res.status(200).json({
    success: true,
    message: "Bid deleted successfully",
  });
});
