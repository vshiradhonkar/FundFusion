import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Global Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./components/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Startup Pages
import StartupDashboard from "./pages/StartupDashboard";
import CreatePitch from "./pages/CreatePitch";

// Investor Pages
import InvestorDashboard from "./pages/InvestorDashboard";
import OffersPage from "./pages/OffersPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminPending from "./pages/AdminPending";
import AdminApproved from "./pages/AdminApproved";

// Utilities
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";

export default function App() {
  return (
    <div className="app-root">
      {/* 🧭 Global Navigation */}
      <Navbar />

      {/* 🌍 Main Content Area */}
      <main className="page-body">
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🚀 Startup Routes */}
          <Route
            path="/startup-dashboard"
            element={
              <ProtectedRoute allow={["startup"]}>
                <StartupDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-pitch"
            element={
              <ProtectedRoute allow={["startup"]}>
                <CreatePitch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute allow={["startup", "investor"]}>
                <OffersPage />
              </ProtectedRoute>
            }
          />

          {/* 💼 Investor Routes */}
          <Route
            path="/investor-dashboard"
            element={
              <ProtectedRoute allow={["investor"]}>
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍⚖️ Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pending"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminPending />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approved"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminApproved />
              </ProtectedRoute>
            }
          />

          {/* 🧭 Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 🦶 Persistent Footer */}
      <Footer />

      {/* 🔔 Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        newestOnTop
        hideProgressBar={false}
        closeOnClick
        draggable
        theme="dark"
        toastStyle={{
          background: "#181727",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid rgba(168,85,247,0.3)",
        }}
      />
    </div>
  );
}
