import mongoose from "mongoose";

const rfqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an RFQ title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide an RFQ description"],
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: [true, "Please provide a start time"],
    },
    endTime: {
      type: Date,
      required: [true, "Please provide an end time"],
    },
    forcedEndTime: {
      type: Date,
      required: [true, "Please provide a forced end time"],
    },
    currentLowestBid: {
      type: Number,
      default: null,
    },
    currentLowestBidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "active", "ended", "cancelled"],
      default: "pending",
    },
    bidsCount: {
      type: Number,
      default: 0,
    },
    autoExtendTime: {
      type: Number,
      default: 300000, // 5 minutes in milliseconds
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const RFQ = mongoose.model("RFQ", rfqSchema);
export default RFQ;
