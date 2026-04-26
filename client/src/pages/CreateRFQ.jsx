import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";

const CreateRFQ = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    forcedEndTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.title || !formData.description) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/rfq/create", formData);
      if (response.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create RFQ";
      setError(message);
    } finally {
      setLoading(false);
    }
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
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl mx-auto dark:bg-slate-900 dark:border dark:border-slate-800">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">Create RFQ</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Create a new Request for Quotation and invite suppliers to bid
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                RFQ Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="e.g., Office Furniture Supply"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Provide details about what you're looking for..."
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Auction Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Auction End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Forced End Time */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Forced End Time (Absolute Cutoff) *
              </label>
              <input
                type="datetime-local"
                name="forcedEndTime"
                value={formData.forcedEndTime}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Auction will end at this time regardless of bids
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Any additional information for suppliers..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create RFQ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRFQ;
