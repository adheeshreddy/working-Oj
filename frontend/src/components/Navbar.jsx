// frontend/src/components/Navbar.jsx
import React from "react";
import {
  Sun,
  Moon,
  User as UserIcon,
  Shield,
  LogOut,
  LogIn,
  LayoutDashboard,
  Code,
  Trophy,
  ListChecks,
  Code2,
} from "lucide-react";

function Navbar({ isAuthenticated, userRole, onLogout, onNavigate, toggleTheme, isDarkMode }) {
  const isAdmin = userRole === "admin";

  const logoStyles = {
    background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontSize: "1.5rem",
    fontWeight: "800",
    letterSpacing: "-0.025em",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top border-bottom">
      <div className="container-fluid px-4">
        {/* Brand */}
        <a
          className="navbar-brand d-flex align-items-center"
          href="#"
          onClick={() => onNavigate("problems")}
          style={{ cursor: "pointer" }}
        >
          <Code2 size={28} style={{ color: "#0f766e" }} className="me-2" />
          <span style={logoStyles} className="mb-0">
            AlgoNest
          </span>
        </a>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center"
                    href="#"
                    onClick={() => onNavigate("dashboard")}
                  >
                    <LayoutDashboard size={18} className="me-2" /> Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center"
                    href="#"
                    onClick={() => onNavigate("problems")}
                  >
                    <Code size={18} className="me-2" /> Problems
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center"
                    href="#"
                    onClick={() => onNavigate("contests")}
                  >
                    <Trophy size={18} className="me-2" /> Contests
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link d-flex align-items-center"
                    href="#"
                    onClick={() => onNavigate("submissions")}
                  >
                    <ListChecks size={18} className="me-2" /> Submissions
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Right Side Controls */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated && (
              <div
                className={`badge d-flex align-items-center px-3 py-2 rounded-pill ${
                  isAdmin ? "bg-info text-dark" : "bg-secondary text-white"
                }`}
                style={{ fontSize: "0.85rem", fontWeight: "500" }}
              >
                {isAdmin ? (
                  <Shield size={14} className="me-1" />
                ) : (
                  <UserIcon size={14} className="me-1" />
                )}
                {userRole.toUpperCase()}
              </div>
            )}

            {/* Theme Toggle
            <button
              onClick={toggleTheme}
              className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button> */}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="btn btn-sm btn-outline-danger d-flex align-items-center px-3"
              >
                <LogOut size={16} className="me-1" /> Logout
              </button>
            ) : (
              <button
                onClick={() => alert("Redirect to login page")}
                className="btn btn-sm btn-outline-success d-flex align-items-center px-3"
              >
                <LogIn size={16} className="me-1" /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;