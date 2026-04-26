import RFQ from "../models/RFQ.js";
import Bid from "../models/Bid.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create RFQ
export const createRFQ = asyncHandler(async (req, res) => {
  const { title, description, startTime, endTime, forcedEndTime, notes } =
    req.body;

  // Validation
  if (!title || !description || !startTime || !endTime || !forcedEndTime) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Validate times
  const start = new Date(startTime);
  const end = new Date(endTime);
  const forcedEnd = new Date(forcedEndTime);

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: "End time must be after start time",
    });
  }

  if (forcedEnd < end) {
    return res.status(400).json({
      success: false,
      message: "Forced end time must be after end time",
    });
  }

  const rfq = await RFQ.create({
    title,
    description,
    startTime: start,
    endTime: end,
    forcedEndTime: forcedEnd,
    buyerId: req.user._id,
    notes: notes || "",
    status: "pending",
  });

  res.status(201).json({
    success: true,
    message: "RFQ created successfully",
    rfq: {
      id: rfq._id,
      title: rfq.title,
      description: rfq.description,
      startTime: rfq.startTime,
      endTime: rfq.endTime,
      forcedEndTime: rfq.forcedEndTime,
      status: rfq.status,
    },
  });
});

// Get all RFQs
export const getAllRFQs = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let query = {};
  if (status) {
    query.status = status;
  }

  const rfqs = await RFQ.find(query)
    .populate("buyerId", "name email company")
    .populate("currentLowestBidderId", "name email company")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: rfqs.length,
    rfqs,
  });
});

// Get RFQ by ID
export const getRFQById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rfq = await RFQ.findById(id)
    .populate("buyerId", "name email company phone")
    .populate("currentLowestBidderId", "name email company phone");

  if (!rfq) {
    return res.status(404).json({
      success: false,
      message: "RFQ not found",
    });
  }

  // Get all bids for this RFQ
  const bids = await Bid.find({ rfqId: id })
    .populate("bidderId", "name email company phone")
    .sort({ bidTime: -1 });

  res.status(200).json({
    success: true,
    rfq,
    bids,
  });
});

// Update RFQ
export const updateRFQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, notes, status, endTime, forcedEndTime } =
    req.body;

  let rfq = await RFQ.findById(id);

  if (!rfq) {
    return res.status(404).json({
      success: false,
      message: "RFQ not found",
    });
  }

  // Check if user is the buyer
  if (rfq.buyerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only update your own RFQs",
    });
  }

  // Update fields
  if (title) rfq.title = title;
  if (description) rfq.description = description;
  if (notes) rfq.notes = notes;
  if (status) rfq.status = status;
  if (endTime) rfq.endTime = new Date(endTime);
  if (forcedEndTime) rfq.forcedEndTime = new Date(forcedEndTime);

  await rfq.save();

  res.status(200).json({
    success: true,
    message: "RFQ updated successfully",
    rfq,
  });
});

// Delete RFQ
export const deleteRFQ = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const rfq = await RFQ.findById(id);

  if (!rfq) {
    return res.status(404).json({
      success: false,
      message: "RFQ not found",
    });
  }

  // Check if user is the buyer
  if (rfq.buyerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own RFQs",
    });
  }

  await RFQ.findByIdAndDelete(id);
  await Bid.deleteMany({ rfqId: id });

  res.status(200).json({
    success: true,
    message: "RFQ deleted successfully",
  });
});

// Get my RFQs (as buyer)
export const getMyRFQs = asyncHandler(async (req, res) => {
  const rfqs = await RFQ.find({ buyerId: req.user._id })
    .populate("currentLowestBidderId", "name email company")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: rfqs.length,
    rfqs,
  });
});
