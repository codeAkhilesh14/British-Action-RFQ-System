import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiPlus, FiTrendingDown, FiFileText, FiUsers } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [rfqs, setRfqs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("rfqs");

  useEffect(() => {
    if (!userData) return;
    fetchData();
  }, [userData]);

  const fetchData = async () => {
    try {
      if (userData?.role === "buyer") {
        const response = await axiosInstance.get("/rfq/my-rfqs");
        if (response.data.success) {
          setRfqs(response.data.rfqs || []);
        }
      } else {
        const [rfqsResponse, bidsResponse] = await Promise.all([
          axiosInstance.get("/rfq/all"),
          axiosInstance.get("/bid/my-bids/all"),
        ]);

        if (rfqsResponse.data.success) {
          setRfqs(rfqsResponse.data.rfqs || []);
        }
        if (bidsResponse.data.success) {
          setMyBids(bidsResponse.data.bids || []);
        }
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRFQ = (rfqId) => {
    navigate(`/rfq/${rfqId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome, {userData?.name}!</p>
          </div>

          {userData?.role === "buyer" && (
            <button
              onClick={() => navigate("/create-rfq")}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
            >
              <FiPlus /> Create RFQ
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {userData?.role === "buyer" ? (
          // BUYER VIEW
          <div className="bg-white rounded-3xl shadow-lg p-6 dark:bg-slate-900 dark:border dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">My RFQs</h2>

            {rfqs.length === 0 ? (
              <div className="text-center py-12">
                <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">No RFQs created yet</p>
                <button
                  onClick={() => navigate("/create-rfq")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create First RFQ
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {rfqs.map((rfq) => (
                  <div
                    key={rfq._id}
                    onClick={() => handleViewRFQ(rfq._id)}
                    className="border border-slate-200 rounded-3xl p-4 hover:shadow-xl transition cursor-pointer bg-white dark:bg-slate-900 dark:border-slate-800"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                          {rfq.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          {rfq.description.substring(0, 100)}...
                        </p>
                        <div className="flex gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <FiUsers /> {rfq.bidsCount} bid{rfq.bidsCount !== 1 ? "s" : ""}
                          </span>
                          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <FiTrendingDown /> £{rfq.currentLowestBid?.toFixed(2) || "N/A"}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {rfq.currentLowestBidderId?.name || "No bids yet"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            rfq.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : rfq.status === "ended"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : rfq.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {rfq.status.toUpperCase()}
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                          {new Date(rfq.endTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // SUPPLIER VIEW
          <div>
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab("rfqs")}
                className={`px-4 py-2 font-bold ${
                  activeTab === "rfqs"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                Available RFQs
              </button>
              <button
                onClick={() => setActiveTab("bids")}
                className={`px-4 py-2 font-bold ${
                  activeTab === "bids"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                My Bids
              </button>
            </div>

            {/* Available RFQs Tab */}
            {activeTab === "rfqs" && (
              <div className="bg-white rounded-3xl shadow-lg p-6 dark:bg-slate-900 dark:border dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Available RFQs</h2>

                <div className="space-y-4">
                  {rfqs && rfqs.length > 0 ? (
                    rfqs.map((rfq) => (
                      <div
                        key={rfq._id}
                        onClick={() => handleViewRFQ(rfq._id)}
                        className="border border-slate-200 rounded-3xl p-4 hover:shadow-xl transition cursor-pointer bg-white dark:bg-slate-900 dark:border-slate-800"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                              {rfq.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                              By: {rfq.buyerId?.name} ({rfq.buyerId?.company})
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                              {rfq.description.substring(0, 100)}...
                            </p>
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <FiUsers /> {rfq.bidsCount} bid(s)
                            </span>
                              {rfq.currentLowestBid && (
                                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                  <FiTrendingDown /> £{rfq.currentLowestBid.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                rfq.status === "active"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                                  : rfq.status === "ended"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {rfq.status.toUpperCase()}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                              Ends:{" "}
                              {new Date(rfq.endTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                      No RFQs available
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* My Bids Tab */}
            {activeTab === "bids" && (
              <div className="bg-white rounded-3xl shadow-lg p-6 dark:bg-slate-900 dark:border dark:border-slate-800">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">My Bids</h2>

                {myBids.length === 0 ? (
                  <div className="text-center py-12">
                    <FiTrendingDown className="mx-auto text-4xl text-slate-400 dark:text-slate-500 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No bids placed yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBids.map((bid) => (
                      <div
                        key={bid._id}
                        onClick={() =>
                          handleViewRFQ(bid.rfqId._id)
                        }
                        className="border border-slate-200 rounded-3xl p-4 hover:shadow-xl transition cursor-pointer bg-white dark:bg-slate-900 dark:border-slate-800"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
                              {bid.rfqId?.title}
                            </h3>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                              £{bid.bidAmount.toFixed(2)}
                            </p>
                            {bid.message && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                Message: {bid.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Bid placed:{" "}
                              {new Date(bid.bidTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
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
                            {bid.rfqId?.status === "ended" && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                                Auction Ended:{" "}
                                {new Date(
                                  bid.rfqId.forcedEndTime
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
