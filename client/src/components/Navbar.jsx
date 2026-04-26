import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu, FiX, FiMoon, FiSun, FiShoppingBag } from "react-icons/fi";
import { logout } from "../redux/userSlice";
import { useTheme } from "../hooks/useTheme";
import axiosInstance from "../api/axiosInstance";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(logout());
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <nav className="bg-slate-900 text-slate-100 shadow-lg dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-blue-400 text-2xl" />
            <Link to="/" className="text-xl font-bold hover:text-slate-200 transition">
              British Auction RFQ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="hover:text-slate-200 transition">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-slate-200 transition">
              Dashboard
            </Link>

            {isAuthenticated && userData?.role === "buyer" && (
              <Link to="/create-rfq" className="hover:text-slate-200 transition">
                Create RFQ
              </Link>
            )}

            <button
              onClick={handleThemeToggle}
              className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 hover:bg-slate-700 transition"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 rounded-full border border-slate-700 bg-slate-800 px-4 py-2">
                <span className="text-sm">{userData?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-slate-200 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-white px-4 py-2 text-slate-900 font-semibold hover:bg-slate-100 transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={handleThemeToggle}
              className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 hover:bg-slate-700 transition"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100">
            <Link
              to="/"
              className="block hover:text-slate-200 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="block hover:text-slate-200 transition"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>

            {isAuthenticated ? (
              <>
                {userData?.role === "buyer" && (
                  <Link
                    to="/create-rfq"
                    className="block hover:text-slate-200 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Create RFQ
                  </Link>
                )}
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-sm mb-2">{userData?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-slate-200 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block rounded-lg bg-white px-4 py-2 text-center text-slate-900 font-semibold hover:bg-slate-100 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
