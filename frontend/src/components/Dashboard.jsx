// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// FIX: Added all necessary lucide-react icon imports
import { User as UserIcon, Mail, BarChart, Clock, Award, Activity, CheckCircle, LogOut, ListChecks, Tag as TagIcon, Gauge, CheckCircle2, XCircle, MemoryStick, TrendingUp, Calendar, Code2 } from 'lucide-react';
const api_url = import.meta.env.VITE_SERVER;
const USER_API_BASE_URL = ` ${api_url}/api/users`;
const SUBMISSION_API_BASE_URL = ` ${api_url}/api/submissions`;

function Dashboard({ userRole, isAuthenticated }) {
    const [userData, setUserData] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        } else {
            setUserData(null);
            setUserStats(null);
            setRecentSubmissions([]);
            setUserActivity([]);
            setMessage('Please log in to view your dashboard.');
            setIsLoading(false);
        }
    }, [isAuthenticated, userRole]); // Re-fetch if auth status or role changes

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch user profile
            const profileResponse = await axios.get(`${USER_API_BASE_URL}/profile`, config);
            const currentUser = profileResponse.data;
            setUserData(currentUser);

            // Fetch user stats
            const statsResponse = await axios.get(`${USER_API_BASE_URL}/${currentUser._id}/stats`, config);
            setUserStats(statsResponse.data);

            // Fetch recent submissions
            const recentSubmissionsResponse = await axios.get(`${USER_API_BASE_URL}/${currentUser._id}/recent-submissions`, config);
            setRecentSubmissions(recentSubmissionsResponse.data);

            // Fetch user activity
            const activityResponse = await axios.get(`${USER_API_BASE_URL}/${currentUser._id}/activity`, config);
            setUserActivity(activityResponse.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error.response?.data || error.message);
            setMessage(`Failed to load dashboard data: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getVerdictBadgeClass = (verdict) => {
        switch (verdict) {
            case 'Accepted': return 'badge-success';
            case 'Wrong Answer': return 'badge-danger';
            case 'Time Limit Exceeded': return 'badge-warning';
            case 'Memory Limit Exceeded': return 'badge-warning';
            case 'Runtime Error': return 'badge-danger';
            case 'Compilation Error': return 'badge-danger';
            case 'Pending': return 'badge-secondary';
            default: return 'badge-info';
        }
    };

    const getVerdictIcon = (verdict) => {
        switch (verdict) {
            case 'Accepted': return <CheckCircle2 size={14} className="me-1" />;
            case 'Pending': return <Clock size={14} className="me-1" />;
            default: return <XCircle size={14} className="me-1" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2d1b69 100%)'}}>
                <div className="text-center">
                    <div className="loading-spinner mb-4">
                        <div className="spinner-pulse"></div>
                    </div>
                    <h4 className="text-white mb-2">Loading Dashboard</h4>
                    <p className="text-white">Fetching your latest data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .dashboard-container {
                    background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2d1b69 100%);
                    min-height: 100vh;
                    position: relative;
                }

                .dashboard-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
                    pointer-events: none;
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .glass-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                }

                .glass-card:hover {
                    transform: translateY(-8px);
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                }

                .gradient-text {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .gradient-text-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .gradient-text-success {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .gradient-text-info {
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stats-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 1rem;
                    transition: all 0.2s ease;
                    margin-bottom: 0.5rem;
                }

                .stats-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .activity-item {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    transition: all 0.2s ease;
                }

                .activity-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateX(4px);
                }

                .badge-success {
                    background: linear-gradient(135deg, #00b09b, #96c93d);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-danger {
                    background: linear-gradient(135deg, #ff416c, #ff4b2b);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-warning {
                    background: linear-gradient(135deg, #f093fb, #f5576c);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-secondary {
                    background: linear-gradient(135deg, #4b6cb7, #182848);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-info {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .role-badge {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .header-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    position: relative;
                    overflow: hidden;
                }

                .header-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
                }

                .loading-spinner {
                    display: inline-block;
                    position: relative;
                }

                .spinner-pulse {
                    display: inline-block;
                    width: 60px;
                    height: 60px;
                    border: 4px solid rgba(102, 126, 234, 0.3);
                    border-radius: 50%;
                    border-top-color: #667eea;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .icon-container {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    position: relative;
                }

                .icon-container-primary {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
                    border: 1px solid rgba(102, 126, 234, 0.3);
                }

                .icon-container-success {
                    background: linear-gradient(135deg, rgba(75, 172, 254, 0.2), rgba(0, 242, 254, 0.2));
                    border: 1px solid rgba(75, 172, 254, 0.3);
                }

                .icon-container-info {
                    background: linear-gradient(135deg, rgba(247, 112, 154, 0.2), rgba(254, 225, 64, 0.2));
                    border: 1px solid rgba(247, 112, 154, 0.3);
                }

                .submission-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 1.25rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .submission-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .alert-modern {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    color: white;
                }
            `}</style>

            <div className="dashboard-container py-5">
                <div className="container position-relative">
                    {/* Modern Header */}
                    <div className="header-card p-4 mb-5">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h1 className="h2 fw-bold text-white mb-2">Welcome Back!</h1>
                                <p className=" text-white mb-0 fs-5">
                                    Ready to solve some problems today, <span className="gradient-text fw-bold">{userData?.name || 'Developer'}</span>?
                                </p>
                            </div>
                            <div className="col-md-4 text-md-end">
                                <div className="d-flex align-items-center justify-content-md-end gap-3">
                                    <Calendar className="text-white" size={20} />
                                    <span className="text-white">{new Date().toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className="alert alert-modern alert-dismissible fade show mb-4" role="alert">
                            <div className="d-flex align-items-center">
                                <CheckCircle className="me-2" size={20} />
                                {message}
                            </div>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setMessage('')} aria-label="Close"></button>
                        </div>
                    )}

                    <div className="row g-4 mb-5">
                        {/* Enhanced User Profile Card */}
                        <div className="col-lg-4 col-md-6">
                            <div className="glass-card h-100 p-4 text-center">
                                <div className="icon-container icon-container-primary">
                                    <UserIcon size={32} className=" text-white gradient-text-primary" />
                                </div>
                                <h5 className="text-white fw-bold mb-2">{userData?.name || 'N/A'}</h5>
                                <div className="d-flex align-items-center justify-content-center mb-3 text-white">
                                    <Mail size={16} className="me-2" />
                                    <span className="small">{userData?.email || 'N/A'}</span>
                                </div>
                                <span className="role-badge">{userRole}</span>
                            </div>
                        </div>

                        {/* Enhanced Stats Card */}
                        <div className="col-lg-4 col-md-6">
                            <div className="glass-card h-100 p-4">
                                <div className="icon-container icon-container-success">
                                    <BarChart size={32} className=" text-white gradient-text-success" />
                                </div>
                                <h5 className="text-white fw-bold mb-3 text-center">Performance Stats</h5>
                                {userStats ? (
                                    <div className="stats-grid">
                                        <div className="stats-item d-flex justify-content-between align-items-center">
                                            <span className="text-white small">Total Submissions</span>
                                            <span className="text-white fw-bold">{userStats.totalSubmissions}</span>
                                        </div>
                                        <div className="stats-item d-flex justify-content-between align-items-center">
                                            <span className="text-white small">Accepted Solutions</span>
                                            <span className="text-success fw-bold">{userStats.acceptedSubmissions}</span>
                                        </div>
                                        <div className="stats-item d-flex justify-content-between align-items-center">
                                            <span className="text-white small">Problems Solved</span>
                                            <span className="text-info fw-bold">{userStats.solvedProblemsCount}</span>
                                        </div>
                                        
                                        <div className="mt-3">
                                            <h6 className="text-white mb-2 small">Difficulty Breakdown</h6>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="text-success small">Easy</span>
                                                <span className="text-white small fw-bold">{userStats.difficultyStats.Easy || 0}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="text-warning small">Medium</span>
                                                <span className="text-white small fw-bold">{userStats.difficultyStats.Medium || 0}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-danger small">Hard</span>
                                                <span className="text-white small fw-bold">{userStats.difficultyStats.Hard || 0}</span>
                                            </div>
                                        </div>

                                        {Object.entries(userStats.tagStats).length > 0 && (
                                            <div className="mt-3">
                                                <h6 className="text-white mb-2 small">Top Tags</h6>
                                                {Object.entries(userStats.tagStats).slice(0, 3).map(([tag, count]) => (
                                                    <div key={tag} className="d-flex justify-content-between align-items-center mb-1">
                                                        <div className="d-flex align-items-center">
                                                            <TagIcon size={12} className="me-1 text-white"/>
                                                            <span className="text-white small">{tag}</span>
                                                        </div>
                                                        <span className="text-white small fw-bold">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <Code2 size={48} className="text-white mb-3" />
                                        <p className="text-white">Start solving problems to see your stats!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Recent Submissions Card */}
                        <div className="col-lg-4 col-md-12">
                            <div className="glass-card h-100 p-4">
                                <div className="icon-container icon-container-info">
                                    <ListChecks size={32} className="text-white gradient-text-info" />
                                </div>
                                <h5 className="text-white fw-bold mb-3 text-center">Recent Submissions</h5>
                                {recentSubmissions.length > 0 ? (
                                    <div className="submissions-list" style={{maxHeight: '350px', overflowY: 'auto'}}>
                                        {recentSubmissions.map(sub => (
                                            <div key={sub._id} className="submission-item">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className="text-info mb-1 small fw-bold">{sub.problemId?.title || 'N/A'}</h6>
                                                    <span className="text-white small">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className={`badge ${getVerdictBadgeClass(sub.verdict)} d-inline-flex align-items-center`}>
                                                    {getVerdictIcon(sub.verdict)}
                                                    {sub.verdict}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <TrendingUp size={48} className="text-white mb-3" />
                                        <p className="text-white">No submissions yet. Start coding!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Activity Section */}
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="glass-card p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <Activity size={24} className="gradient-text-info me-3" />
                                    <h5 className="text-white fw-bold mb-0">Recent Activity</h5>
                                </div>
                                
                                {userActivity.length > 0 ? (
                                    <div className="activity-timeline" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {userActivity.map((activity, index) => (
                                            <div key={index} className="activity-item">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <div className="activity-dot me-3" style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #667eea, #764ba2)'
                                                        }}></div>
                                                        <span className="text-white">{activity.description}</span>
                                                    </div>
                                                    <span className="text-white small">{new Date(activity.timestamp).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <Activity size={64} className="text-white mb-3" />
                                        <h6 className="text-white">No recent activity</h6>
                                        <p className="text-white small">Your coding journey starts here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;