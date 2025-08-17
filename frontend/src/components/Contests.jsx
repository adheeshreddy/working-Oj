// frontend/src/components/Contests.jsx
import React from "react";
import { Trophy, AlertCircle } from "lucide-react";

function Contests() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
       

        <div className="d-flex align-items-center justify-content-center">
          <div className="card border-0 shadow-sm rounded-3 p-5 text-center" style={{ maxWidth: "500px" }}>
            <AlertCircle size={50} className="mb-3 text-secondary" />
            <h2 className="h5 fw-bold text-dark mb-2">Contests Feature Coming Soon 🚀</h2>
            <p className="text-muted mb-0">
              Stay tuned! We are working on bringing upcoming coding contests Along with Dark Mode and more features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contests;
