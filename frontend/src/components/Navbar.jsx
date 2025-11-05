import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const roleRaw = (localStorage.getItem("role") || "").toLowerCase();
  const role = ["admin", "investor", "startup"].includes(roleRaw)
    ? roleRaw
    : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const prettyRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Guest";
  const isAuth = Boolean(token && role);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  //close menu when link is clicked in mobile
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
    
      <div className="nav-left">
        <Link className="nav-logo" to="/" onClick={handleLinkClick}>
          FundFusion <span>PitchHub</span>
        </Link>
      </div>

      <button
        className="nav-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      <div className={`nav-center ${menuOpen ? "open" : ""}`}>
        {!isAuth ? (
          <>
            <Link
              to="/"
              onClick={handleLinkClick}
              className={pathname === "/" ? "active" : ""}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={handleLinkClick}
              className={pathname === "/about" ? "active" : ""}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={handleLinkClick}
              className={pathname === "/contact" ? "active" : ""}
            >
              Contact
            </Link>
            <Link
              to="/register"
              onClick={handleLinkClick}
              className={pathname === "/register" ? "active" : ""}
            >
              Register
            </Link>
            <Link
              to="/login"
              onClick={handleLinkClick}
              className={pathname === "/login" ? "active" : ""}
            >
              Login
            </Link>
          </>
        ) : role === "startup" ? (
          <>
            <Link
              to="/startup-dashboard"
              onClick={handleLinkClick}
              className={pathname === "/startup-dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="/create-pitch"
              onClick={handleLinkClick}
              className={pathname === "/create-pitch" ? "active" : ""}
            >
              Create Pitch
            </Link>
            <Link
              to="/offers"
              onClick={handleLinkClick}
              className={pathname === "/offers" ? "active" : ""}
            >
              Offers
            </Link>
          </>
        ) : role === "investor" ? (
          <>
            <Link
              to="/investor-dashboard"
              onClick={handleLinkClick}
              className={pathname === "/investor-dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="/offers"
              onClick={handleLinkClick}
              className={pathname === "/offers" ? "active" : ""}
            >
              My Offers
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/admin-dashboard"
              onClick={handleLinkClick}
              className={pathname === "/admin-dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/pending"
              onClick={handleLinkClick}
              className={pathname === "/admin/pending" ? "active" : ""}
            >
              Pending Pitches
            </Link>
            <Link
              to="/admin/approved"
              onClick={handleLinkClick}
              className={pathname === "/admin/approved" ? "active" : ""}
            >
              Approved Pitches
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        <span className="role-text">{prettyRole}</span>
        {isAuth && (
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
