import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiClock, FiTrendingDown } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";

const RFQDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [rfq, setRfq] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRFQDetails();
  }, [id]);

  const fetchRFQDetails = async () => {
    try {
      const response = await axiosInstance.get(`/rfq/${id}`);
      if (response.data.success) {
        setRfq(response.data.rfq);
        setBids(response.data.bids || []);
      }
    } catch (err) {
      setError("Failed to fetch RFQ details");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setPlacingBid(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/bid/place", {
        rfqId: id,
        bidAmount: parseFloat(bidAmount),
        message: bidMessage,
      });

      if (response.data.success) {
        setSuccess("Bid placed successfully!");
        setBidAmount("");
        setBidMessage("");
        fetchRFQDetails(); // Refresh data
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="container mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
          RFQ not found
        </div>
      </div>
    );
  }

  const isOwner = userData?.id === rfq.buyerId._id;
  const isSupplier = userData?.role === "supplier";
  const canPlaceBid = isSupplier && !isOwner;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-10">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* RFQ Details */}
            <div className="bg-white rounded-3xl shadow-lg p-6 dark:bg-slate-900 dark:border dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {rfq.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Posted by: {rfq.buyerId.name} ({rfq.buyerId.company})
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-white font-bold text-sm ${
                    rfq.status === "active"
                      ? "bg-green-500"
                      : rfq.status === "ended"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {rfq.status.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6">{rfq.description}</p>

              {rfq.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 mb-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Notes:</strong> {rfq.notes}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Start Time</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {new Date(rfq.startTime).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">End Time</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {new Date(rfq.endTime).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Forced End Time</p>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {new Date(rfq.forcedEndTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Current Lowest Bid */}
              {rfq.currentLowestBid && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-3xl">
                  <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiTrendingDown /> Current Lowest Bid
                  </p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    £{rfq.currentLowestBid.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    By: {rfq.currentLowestBidderId?.name}
                  </p>
                </div>
              )}
            </div>

            {/* All Bids */}
            <div className="bg-white rounded-3xl shadow-lg p-6 dark:bg-slate-900 dark:border dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">All Bids ({bids.length})</h2>

              {bids.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No bids placed yet</p>
              ) : (
                <div className="space-y-3">
                  {bids.map((bid) => (
                    <div
                      key={bid._id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition bg-white dark:bg-slate-800"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-gray-100">
                            £{bid.bidAmount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            By: {bid.bidderId.name} ({bid.bidderId.company})
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <FiClock size={12} />
                            {new Date(bid.bidTime).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            bid.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : bid.status === "won"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {bid.status.toUpperCase()}
                        </span>
                      </div>
                      {bid.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          Message: {bid.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Bid Form */}
          {canPlaceBid && rfq.status !== "ended" && (
            <div className="bg-white rounded-3xl shadow-lg p-6 h-fit dark:bg-slate-900 dark:border dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Place Bid</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                  {success}
                </div>
              )}

              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Bid Amount (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Enter amount"
                  />
                  {rfq.currentLowestBid && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Must be less than £{rfq.currentLowestBid.toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    rows="3"
                    className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Add a message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={placingBid}
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {placingBid ? "Placing Bid..." : "Place Bid"}
                </button>
              </form>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-gray-700 dark:text-gray-300">
                <p className="font-semibold mb-2">British Auction Rules:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Each bid must be lower than previous</li>
                  <li>Auction extends if bid near end time</li>
                  <li>Forced end time is absolute cutoff</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQDetails;
