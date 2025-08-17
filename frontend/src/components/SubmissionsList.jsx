// frontend/src/components/SubmissionsList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ListChecks,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
} from "lucide-react";

const api_url = import.meta.env.VITE_SERVER;
const SUBMISSION_API_BASE_URL = `${api_url}/api/submissions`;

function SubmissionsList({ userRole, isAuthenticated }) {
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState("");
  const [filterVerdict, setFilterVerdict] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    } else {
      setSubmissions([]);
      setMessage("Please log in to view your submissions.");
    }
  }, [isAuthenticated, filterVerdict]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let url = SUBMISSION_API_BASE_URL;
      if (userRole === "user") {
        url = `${SUBMISSION_API_BASE_URL}/user/${
          JSON.parse(atob(token.split(".")[1])).id
        }`;
      }

      const response = await axios.get(url, config);
      let filteredData = response.data;

      if (filterVerdict !== "All") {
        filteredData = response.data.filter(
          (sub) => sub.verdict === filterVerdict
        );
      }
      setSubmissions(filteredData);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setMessage(
        `Failed to fetch submissions: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case "Accepted":
        return { class: "bg-success text-white", icon: <CheckCircle2 size={16} /> };
      case "Pending":
        return { class: "bg-secondary text-white", icon: <Clock size={16} /> };
      default:
        return { class: "bg-danger text-white", icon: <XCircle size={16} /> };
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <header className="bg-white shadow-sm p-4 mb-5 rounded-3 border">
          <h1 className="h4 fw-bold mb-0 d-flex align-items-center text-dark">
            <ListChecks size={26} className="me-2 text-primary" /> Submissions
          </h1>
          <p className="text-muted mt-2">
            Review your past submissions and their verdicts.
          </p>
        </header>

        {message && (
          <div className="alert alert-info rounded-3 mb-4">{message}</div>
        )}

        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-semibold text-dark mb-0">All Submissions</h2>
              <select
                id="filterVerdict"
                className="form-select rounded-pill"
                value={filterVerdict}
                onChange={(e) => setFilterVerdict(e.target.value)}
                style={{ width: "auto" }}
              >
                <option value="All">All</option>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
                <option value="Runtime Error">Runtime Error</option>
                <option value="Compilation Error">Compilation Error</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted mt-2">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center text-muted py-5 border rounded-3 bg-light">
                <p className="mb-0 fs-6">No submissions found.</p>
              </div>
            ) : (
              <div className="list-group">
                {submissions.map((sub) => {
                  const verdict = getVerdictStyle(sub.verdict);
                  return (
                    <div
                      key={sub._id}
                      className="list-group-item list-group-item-action border-0 mb-3 shadow-sm rounded-3 p-3"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 text-dark fw-semibold">
                            {sub.problemId?.title || "N/A"}
                          </h6>
                          <span
                            className={`badge rounded-pill ${
                              sub.problemId?.difficulty === "Easy"
                                ? "bg-success"
                                : sub.problemId?.difficulty === "Medium"
                                ? "bg-warning text-dark"
                                : sub.problemId?.difficulty === "Hard"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {sub.problemId?.difficulty || "N/A"}
                          </span>
                          <p className="text-muted small mb-1">
                            {sub.language.toUpperCase()} •{" "}
                            {new Date(sub.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`badge d-flex align-items-center gap-1 ${verdict.class} px-3 py-2`}
                          >
                            {verdict.icon} {sub.verdict}
                          </span>
                          <div className="text-muted small mt-2 text-end">
                            <Cpu size={14} className="me-1" />
                            {sub.executionTime
                              ? `${sub.executionTime} ms`
                              : "N/A"}{" "}
                            • {sub.memoryUsed ? `${sub.memoryUsed} MB` : "N/A"}
                          </div>
                          {userRole === "admin" && (
                            <div className="small text-muted mt-1">
                              User: {sub.userId?.name || "N/A"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmissionsList;
