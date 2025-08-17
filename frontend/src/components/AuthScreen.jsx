import React, { useState, useEffect } from "react";
import { LogIn, User as UserIcon, Shield, ArrowLeft, Code2 } from "lucide-react";

function AuthScreen({ onLogin, onRegister, message }) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentAuthMessage, setCurrentAuthMessage] = useState(message);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    setCurrentAuthMessage(message);
  }, [message, isLoginMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentAuthMessage("");
    if (isLoginMode) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
    }
  };

  const handleUserLoginClick = () => {
    setShowLanding(false);
    setIsLoginMode(true);
  };

  const handleAdminLoginClick = () => {
    setShowLanding(false);
    setIsLoginMode(true);
  };

  const handleRegisterClick = () => {
    setShowLanding(false);
    setIsLoginMode(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
    setName("");
    setEmail("");
    setPassword("");
    setCurrentAuthMessage("");
  };

  // Simple styles
  const customStyles = {
    background: {
      background: "#f9fafb",
      minHeight: "100vh",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
    btnPrimary: {
      background: "#0f766e",
      border: "none",
      color: "white",
      transition: "0.2s",
    },
    btnSuccess: {
      background: "#f97316",
      border: "none",
      color: "white",
      transition: "0.2s",
    },
    btnWarning: {
      background: "#6366f1",
      border: "none",
      color: "white",
      transition: "0.2s",
    },
    formControl: {
      background: "#f3f4f6",
      border: "1px solid #d1d5db",
      color: "#111827",
    },
    heading: {
      color: "#111827",
    },
    logo: {
      background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontSize: "2.5rem",
      fontWeight: "800",
      letterSpacing: "-0.025em",
    }
  };

  // Landing Screen
  if (showLanding) {
    return (
      <div
        style={customStyles.background}
        className="d-flex align-items-center justify-content-center"
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div
                className="card border-0 rounded-4 text-center p-5"
                style={customStyles.card}
              >
                {/* Modern Text Logo */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Code2 size={40} style={{ color: "#0f766e" }} className="me-2" />
                    <h1 style={customStyles.logo} className="mb-0">
                      AlgoNest
                    </h1>
                  </div>
                  <p className="text-muted mb-0">Master Algorithms, Build Your Future</p>
                </div>

                <div className="d-grid gap-3 col-md-10 col-lg-8 mx-auto">
                  <button
                    onClick={handleUserLoginClick}
                    className="btn btn-lg rounded-pill py-3 px-5 fw-bold"
                    style={customStyles.btnPrimary}
                  >
                    <UserIcon size={22} className="me-2" /> User Login
                  </button>

                  <button
                    onClick={handleAdminLoginClick}
                    className="btn btn-lg rounded-pill py-3 px-5 fw-bold"
                    style={customStyles.btnSuccess}
                  >
                    <Shield size={22} className="me-2" /> Admin Login
                  </button>

                  <button
                    onClick={handleRegisterClick}
                    className="btn btn-lg rounded-pill py-3 px-5 fw-bold"
                    style={customStyles.btnWarning}
                  >
                    <LogIn size={22} className="me-2" /> Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register screen
  return (
    <div
      style={customStyles.background}
      className="d-flex align-items-center justify-content-center"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div
              className="card border-0 rounded-4 p-4"
              style={customStyles.card}
            >
              <div className="card-body">
                <button
                  className="btn btn-link d-flex align-items-center mb-4 fw-semibold p-0"
                  onClick={handleBackToLanding}
                  style={{ textDecoration: "none", color: "#0f766e" }}
                >
                  <ArrowLeft size={20} className="me-2" /> Back
                </button>

                {/* Compact Logo for Login/Register */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Code2 size={32} style={{ color: "#0f766e" }} className="me-2" />
                    <h2 style={{ ...customStyles.logo, fontSize: "2rem" }} className="mb-0">
                      AlgoNest
                    </h2>
                  </div>
                </div>

                <h3
                  className="text-center mb-4 fw-bold"
                  style={customStyles.heading}
                >
                  {isLoginMode ? "Welcome Back" : "Join AlgoNest"}
                </h3>

                <form onSubmit={handleSubmit}>
                  {!isLoginMode && (
                    <div className="mb-3">
                      <label
                        htmlFor="name"
                        className="form-label fw-semibold text-dark"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-pill py-2 px-3"
                        style={customStyles.formControl}
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold text-dark"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control rounded-pill py-2 px-3"
                      style={customStyles.formControl}
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold text-dark"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-pill py-2 px-3"
                      style={customStyles.formControl}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {currentAuthMessage && (
                    <div className="alert alert-info rounded-3 text-center">
                      {currentAuthMessage}
                    </div>
                  )}

                  <div className="d-grid mt-3">
                    <button
                      type="submit"
                      className="btn btn-lg rounded-pill py-2 fw-bold"
                      style={customStyles.btnPrimary}
                    >
                      {isLoginMode ? "Login" : "Register"}
                    </button>
                  </div>
                </form>

                <p className="text-center mt-4 mb-0">
                  {isLoginMode
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setCurrentAuthMessage("");
                    }}
                    className="btn btn-link p-0 border-0 fw-semibold"
                    style={{ color: "#0f766e", textDecoration: "underline" }}
                  >
                    {isLoginMode ? "Register here" : "Login here"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;