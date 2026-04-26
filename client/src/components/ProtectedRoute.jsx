import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { userData, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
