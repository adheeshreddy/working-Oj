// frontend/src/components/Contests.jsx
import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, Link, AlertTriangle } from 'lucide-react';

// Helper function to format duration from seconds to hours
const formatDuration = (seconds) => {
    return (seconds / 3600).toFixed(2);
};

// Helper function to format UNIX timestamp to a readable local string
const formatDateTime = (seconds) => {
    return new Date(seconds * 1000).toLocaleString();
};

function Contests() {
    // State for contests, loading, and errors
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                // Fetch data from the Codeforces API
                const response = await fetch("https://codeforces.com/api/contest.list");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();

                // Process the API response
                const upcomingContests = data.result
                    .filter(contest => contest.phase === "BEFORE") // Filter for contests that haven't started
                    .map(contest => ({
                        id: contest.id,
                        name: contest.name,
                        platform: "Codeforces", // Set platform explicitly
                        startTime: formatDateTime(contest.startTimeSeconds),
                        endTime: formatDateTime(contest.startTimeSeconds + contest.durationSeconds),
                        duration: `${formatDuration(contest.durationSeconds)} hours`,
                        link: `https://codeforces.com/contest/${contest.id}`
                    }))
                    .reverse(); // Show the nearest contests first

                setContests(upcomingContests);
            } catch (err) {
                console.error("Failed to fetch contests from Codeforces:", err);
                setError("Could not load contest data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchContests();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="bg-dark min-vh-100 py-5">
            <div className="container">
                <header className="bg-dark text-white p-4 mb-5 rounded-3 border-bottom border-info border-3">
                    <h1 className="h3 fw-bold mb-0 d-flex align-items-center">
                        <Trophy size={28} className="me-2 text-warning" /> Upcoming Coding Contests
                    </h1>
                    <p className="text-muted">Stay updated with the latest competitive programming events from Codeforces.</p>
                </header>

                {loading ? (
                    <div className="text-center text py-5">
                        <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 fs-5">Fetching Contests...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-danger py-5 border border-danger rounded-3 card-themed">
                        <AlertTriangle size={48} className="mb-3" />
                        <p className="mb-0 fs-5">{error}</p>
                    </div>
                ) : contests.length === 0 ? (
                    <div className="text-center text-muted py-5 border border-secondary rounded-3 card-themed">
                        <p className="mb-0 fs-5">No upcoming contests found on Codeforces at the moment.</p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {contests.map(contest => (
                            <div className="col" key={contest.id}>
                                <div className="card card-themed shadow-sm rounded-3 h-100 border-secondary">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text fw-bold mb-2">{contest.name}</h5>
                                        <p className="card-text text-muted small mb-3">{contest.platform}</p>
                                        <ul className="list-unstyled text small mb-3 flex-grow-1">
                                            <li className="d-flex align-items-center mb-1">
                                                <Calendar size={14} className="me-2 text-info" />
                                                Start: {contest.startTime}
                                            </li>
                                            <li className="d-flex align-items-center mb-1">
                                                <Calendar size={14} className="me-2 text-info" />
                                                End: {contest.endTime}
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <Clock size={14} className="me-2 text-info" />
                                                Duration: {contest.duration}
                                            </li>
                                        </ul>
                                        <div className="d-grid mt-auto">
                                            <a href={contest.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info rounded-pill d-flex align-items-center justify-content-center py-2">
                                                <Link size={16} className="me-2" /> Visit Contest
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Contests;