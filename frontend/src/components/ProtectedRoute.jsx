import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children, allow = [] }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  
  if (!token || !role) {
    toast.warn("⚠️ Please log in to continue.");
    return <Navigate to="/login" replace />;
  }

  if (allow.length && !allow.includes(role)) {
    toast.error("🚫 Access denied. You don’t have permission for this page.");

    if (role === "startup") return <Navigate to="/startup-dashboard" replace />;
    if (role === "investor") return <Navigate to="/investor-dashboard" replace />;
    if (role === "admin") return <Navigate to="/admin-dashboard" replace />;

    return <Navigate to="/login" replace />;
  }

  
  return children;
}
