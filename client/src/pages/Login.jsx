import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiMail, FiLock } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { setUserData, setError } from "../redux/userSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.data.success) {
        dispatch(setUserData(response.data.user));
        navigate("/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setLocalError(message);
      dispatch(setError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md dark:bg-slate-900 dark:border dark:border-slate-800">
        <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2 text-center">
          Login
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Sign in to your account
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <FiMail className="inline mr-2" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="john@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              <FiLock className="inline mr-2" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg bg-white px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-gray-700 font-semibold mb-2">Demo Accounts:</p>
          <p className="text-xs text-gray-600">
            <strong>Buyer:</strong> buyer@example.com / password
          </p>
          <p className="text-xs text-gray-600">
            <strong>Supplier:</strong> supplier@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
