import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    rfqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFQ",
      required: true,
    },
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidAmount: {
      type: Number,
      required: [true, "Please provide a bid amount"],
    },
    bidTime: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      default: "",
    },
    isWinning: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "outbid", "won", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;
