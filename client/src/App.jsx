import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useTheme } from "./hooks/useTheme";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateRFQ from "./pages/CreateRFQ";
import RFQDetails from "./pages/RFQDetails";

// Main App Component
function AppContent() {
  useGetCurrentUser();
  useTheme(); // Initialize theme on app load

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-rfq"
          element={
            <ProtectedRoute requiredRole="buyer">
              <CreateRFQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rfq/:id"
          element={
            <ProtectedRoute>
              <RFQDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Wrap with Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
