import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartupDashboard from "./pages/StartupDashboard";
import CreatePitch from "./pages/CreatePitch";
import InvestorDashboard from "./pages/InvestorDashboard";
import OffersPage from "./pages/OffersPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPending from "./pages/AdminPending";
import AdminApproved from "./pages/AdminApproved";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles.css";

export default function App() {
  return (
    <div className="app-root">
      
      <Navbar />

      
      <main className="page-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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

          {/*Investor*/}
          <Route
            path="/investor-dashboard"
            element={
              <ProtectedRoute allow={["investor"]}>
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />

          {/*Admin*/}
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/*Toast notifications*/}
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
          boxShadow: "0 0 20px rgba(168,85,247,0.15)",
        }}
      />
    </div>
  );
}
