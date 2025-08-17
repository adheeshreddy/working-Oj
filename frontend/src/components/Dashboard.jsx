// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    User as UserIcon, 
    Mail, 
    BarChart, 
    Clock, 
    Award, 
    Activity, 
    CheckCircle, 
    LogOut, 
    ListChecks, 
    Tag as TagIcon, 
    Gauge, 
    CheckCircle2, 
    XCircle, 
    MemoryStick, 
    TrendingUp, 
    Calendar, 
    Code2,
    Target,
    Trophy,
    Zap
} from 'lucide-react';

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
    }, [isAuthenticated, userRole]);

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

    const getVerdictStyle = (verdict) => {
        switch (verdict) {
            case 'Accepted':
                return { class: "bg-success text-white", icon: <CheckCircle2 size={16} /> };
            case 'Pending':
                return { class: "bg-secondary text-white", icon: <Clock size={16} /> };
            default:
                return { class: "bg-danger text-white", icon: <XCircle size={16} /> };
        }
    };

    if (isLoading) {
        return (
            <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}></div>
                    <h4 className="text-dark mb-2">Loading Dashboard</h4>
                    <p className="text-muted">Fetching your latest data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 mb-5 rounded-3 border">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1 className="h4 fw-bold mb-0 d-flex align-items-center text-dark">
                                <BarChart size={26} className="me-2 text-primary" /> Dashboard
                            </h1>
                            <p className="text-muted mt-2">
                                Welcome back, <span className="text-primary fw-semibold">{userData?.name || 'Developer'}</span>! 
                                Ready to solve some problems today?
                            </p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <div className="d-flex align-items-center justify-content-md-end text-muted">
                                <Calendar size={18} className="me-2" />
                                <span className="small">{new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {message && (
                    <div className="alert alert-info rounded-3 mb-4">
                        {message}
                        <button type="button" className="btn-close float-end" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}

                {/* Top Stats Row - Quick Overview */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <div className="d-flex align-items-center justify-content-center mb-3 bg-primary bg-opacity-10 rounded-circle mx-auto" style={{width: '60px', height: '60px', minWidth: '60px', minHeight: '60px'}}>
                                    <Target size={24} className="text-primary" />
                                </div>
                                <h3 className="h4 fw-bold text-dark mb-1">{userStats?.totalSubmissions || 0}</h3>
                                <p className="text-muted small mb-0">Total Submissions</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <div className="d-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 rounded-circle mx-auto" style={{width: '60px', height: '60px', minWidth: '60px', minHeight: '60px'}}>
                                    <Trophy size={24} className="text-success" />
                                </div>
                                <h3 className="h4 fw-bold text-dark mb-1">{userStats?.acceptedSubmissions || 0}</h3>
                                <p className="text-muted small mb-0">Accepted Solutions</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <div className="d-flex align-items-center justify-content-center mb-3 bg-info bg-opacity-10 rounded-circle mx-auto" style={{width: '60px', height: '60px', minWidth: '60px', minHeight: '60px'}}>
                                    <Zap size={24} className="text-info" />
                                </div>
                                <h3 className="h4 fw-bold text-dark mb-1">{userStats?.solvedProblemsCount || 0}</h3>
                                <p className="text-muted small mb-0">Problems Solved</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-3 col-md-6">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <div className="d-flex align-items-center justify-content-center mb-3 bg-warning bg-opacity-10 rounded-circle mx-auto" style={{width: '60px', height: '60px', minWidth: '60px', minHeight: '60px'}}>
                                    <Award size={24} className="text-warning" />
                                </div>
                                <h3 className="h4 fw-bold text-dark mb-1">
                                    {userStats ? Math.round((userStats.acceptedSubmissions / (userStats.totalSubmissions || 1)) * 100) : 0}%
                                </h3>
                                <p className="text-muted small mb-0">Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Row */}
                <div className="row g-4 mb-5">
                    {/* User Profile Card - Left Side */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body p-4 text-center">
                                <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mx-auto mb-3" style={{width: '80px', height: '80px'}}>
                                    <UserIcon size={32} className="text-primary" />
                                </div>
                                <h5 className="text-dark fw-bold mb-2">{userData?.name || 'N/A'}</h5>
                                <div className="d-flex align-items-center justify-content-center mb-3 text-muted">
                                    <Mail size={16} className="me-2" />
                                    <span className="small">{userData?.email || 'N/A'}</span>
                                </div>
                                <span className={`badge px-3 py-2 rounded-pill fw-semibold ${
                                    userRole === 'admin' ? 'bg-danger text-white' : 'bg-primary text-white'
                                }`}>
                                    {userRole?.toUpperCase()}
                                </span>
                                
                                {/* Quick Stats in Profile */}
                                {userStats && (
                                    <div className="mt-4 pt-3 border-top">
                                        <div className="row text-center">
                                            <div className="col-4">
                                                <div className="text-success fw-bold">{userStats.difficultyStats?.Easy || 0}</div>
                                                <div className="text-muted small">Easy</div>
                                            </div>
                                            <div className="col-4">
                                                <div className="text-warning fw-bold">{userStats.difficultyStats?.Medium || 0}</div>
                                                <div className="text-muted small">Medium</div>
                                            </div>
                                            <div className="col-4">
                                                <div className="text-danger fw-bold">{userStats.difficultyStats?.Hard || 0}</div>
                                                <div className="text-muted small">Hard</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Submissions - Center */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                                    <ListChecks size={20} className="me-2 text-primary" /> 
                                    Recent Submissions
                                </h5>
                                
                                {recentSubmissions.length > 0 ? (
                                    <div className="submission-list" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {recentSubmissions.map(sub => {
                                            const verdict = getVerdictStyle(sub.verdict);
                                            return (
                                                <div key={sub._id} className="list-group-item list-group-item-action border-0 mb-3 shadow-sm rounded-3 p-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1 text-dark fw-semibold">
                                                                {sub.problemId?.title || 'N/A'}
                                                            </h6>
                                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                                <span className={`badge rounded-pill ${
                                                                    sub.problemId?.difficulty === 'Easy' ? 'bg-success' :
                                                                    sub.problemId?.difficulty === 'Medium' ? 'bg-warning text-dark' :
                                                                    sub.problemId?.difficulty === 'Hard' ? 'bg-danger' : 'bg-secondary'
                                                                }`}>
                                                                    {sub.problemId?.difficulty || 'N/A'}
                                                                </span>
                                                                <span className="text-muted small">
                                                                    {sub.language?.toUpperCase()} • {new Date(sub.submittedAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-end">
                                                            <span className={`badge d-flex align-items-center gap-1 ${verdict.class} px-3 py-2 mb-2`}>
                                                                {verdict.icon} {sub.verdict}
                                                            </span>
                                                            <div className="text-muted small">
                                                                <Clock size={12} className="me-1" />
                                                                {sub.executionTime ? `${sub.executionTime} ms` : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <TrendingUp size={48} className="mb-3 opacity-50" />
                                        <h6 className="text-muted">No submissions yet</h6>
                                        <p className="small">Start coding to see your progress!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Stats & Activity */}
                <div className="row g-4">
                    {/* Detailed Stats */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                                    <BarChart size={20} className="me-2 text-primary" /> 
                                    Performance Analytics
                                </h5>
                                
                                {userStats && Object.entries(userStats.tagStats || {}).length > 0 ? (
                                    <div>
                                        <h6 className="text-dark mb-3 small fw-semibold">Top Problem Categories</h6>
                                        <div className="row g-3">
                                            {Object.entries(userStats.tagStats).slice(0, 6).map(([tag, count]) => (
                                                <div key={tag} className="col-md-6">
                                                    <div className="border rounded-3 p-3 bg-light">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                <TagIcon size={16} className="me-2 text-primary"/>
                                                                <span className="text-dark small fw-semibold">{tag}</span>
                                                            </div>
                                                            <span className="badge bg-primary rounded-pill">{count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <Code2 size={48} className="mb-3 opacity-50" />
                                        <h6 className="text-muted">No stats available</h6>
                                        <p className="small">Start solving problems to see detailed analytics!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm border-0 rounded-3 h-100">
                            <div className="card-body p-4">
                                <h5 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                                    <Activity size={20} className="me-2 text-primary" /> 
                                    Recent Activity
                                </h5>
                                
                                {userActivity.length > 0 ? (
                                    <div className="activity-timeline" style={{maxHeight: '300px', overflowY: 'auto'}}>
                                        {userActivity.map((activity, index) => (
                                            <div key={index} className="border-start border-primary border-3 ps-3 pb-3 mb-3 position-relative">
                                                <div className="position-absolute bg-primary rounded-circle" 
                                                     style={{width: '8px', height: '8px', left: '-5px', top: '8px'}}></div>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <p className="text-dark mb-1 small">{activity.description}</p>
                                                        <span className="text-muted small">
                                                            {new Date(activity.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <Activity size={48} className="mb-3 opacity-50" />
                                        <h6 className="text-muted">No recent activity</h6>
                                        <p className="small">Your coding journey starts here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;