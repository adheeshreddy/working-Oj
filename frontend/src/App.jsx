// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import the refactored components
import AuthScreen from './components/AuthScreen.jsx';
import AdminProblemPanel from './components/AdminProblemPanel.jsx';
import SolveProblemScreen from './components/SolveProblemScreen.jsx';
import Navbar from './components/Navbar.jsx'; // New Navbar component
import Dashboard from './components/Dashboard.jsx'; // New Dashboard component
import Contests from './components/Contests.jsx'; // New Contests component
import SubmissionsList from './components/SubmissionsList.jsx'; // New SubmissionsList component
const api_url = import.meta.env.VITE_SERVER;
// Base URL for user authentication API
const USER_API_BASE_URL = `${api_url}/users`;

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('guest'); // 'guest', 'user', 'admin'
    const [authMessage, setAuthMessage] = useState('');
    const [problemToSolve, setProblemToSolve] = useState(null); // State for problem to solve
    const [currentPage, setCurrentPage] = useState('problems'); // 'problems', 'dashboard', 'contests', 'submissions'
    const [isDarkMode, setIsDarkMode] = useState(true); // Theme state

    // Apply/remove light-mode class to HTML on theme change
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole('guest');
        setAuthMessage('Logged out successfully.');
        setCurrentPage('problems'); // Go back to problems list (which will show auth screen)
    };

    // FIX: Add Axios Interceptor for automatic logout on 401/403
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                // If the error response status is 401 (Unauthorized) or 403 (Forbidden)
                // and it's not a login/register attempt itself
                if (error.response && (error.response.status === 401 || error.response.status === 403) &&
                    !error.config.url.includes('/api/users/login') &&
                    !error.config.url.includes('/api/users/register')) {
                    
                    console.warn("Authentication error (401/403) detected. Logging out...");
                    handleLogout(); // Trigger logout
                    setAuthMessage('Your session has expired or is invalid. Please log in again.');
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on component unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [handleLogout]); // Re-run if handleLogout changes (though it's stable here)


    // Check for token in localStorage on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Date.now() / 1000; // in seconds
                if (decoded.exp < currentTime) {
                    console.warn("Token expired on client-side. Logging out.");
                    handleLogout();
                    setAuthMessage('Your session has expired. Please log in again.');
                } else {
                    setIsAuthenticated(true);
                    setUserRole(decoded.userType);
                }
            } catch (error) {
                console.error("Error decoding or verifying token:", error);
                handleLogout();
                setAuthMessage('Your session is invalid. Please log in again.');
            }
        }
    }, []); // Empty dependency array means this runs once on mount


    const handleLogin = async (email, password) => {
        setAuthMessage('');
        try {
            const response = await axios.post(`${USER_API_BASE_URL}/login`, { email, password });
            const { token, userType } = response.data;
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setUserRole(userType);
            setAuthMessage('Login successful!');
            setCurrentPage('problems'); // Navigate to problems list after login
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            setAuthMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setIsAuthenticated(false);
            setUserRole('guest');
        }
    };

    const handleRegister = async (name, email, password) => {
        setAuthMessage('');
        try {
            const response = await axios.post(`${USER_API_BASE_URL}/register`, { name, email, password });
            const { token, userType: registeredUserType } = response.data;
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setUserRole(registeredUserType);
            setAuthMessage('Registration successful! You are now logged in.');
            setCurrentPage('problems'); // Navigate to problems list after registration
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            setAuthMessage(error.response?.data?.message || 'Registration failed.');
            setIsAuthenticated(false);
            setUserRole('guest');
        }
    };

    const handleSolveProblemClick = (problem) => {
        setProblemToSolve(problem);
    };

    const handleCloseSolveProblem = () => {
        setProblemToSolve(null);
        setCurrentPage('problems'); // Go back to problems list
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setProblemToSolve(null); // Clear problem to solve when navigating
    };

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };


    // Conditional rendering based on authentication and current page
    if (!isAuthenticated) {
        return (
            <AuthScreen
                onLogin={handleLogin}
                onRegister={handleRegister}
                message={authMessage}
            />
        );
    }

    if (problemToSolve) {
        return (
            <SolveProblemScreen
                problem={problemToSolve}
                onClose={handleCloseSolveProblem}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
            />
        );
    }

    return (
        <>
            <Navbar
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
            />
            {currentPage === 'problems' && (
                <AdminProblemPanel
                    userRole={userRole}
                    isAuthenticated={isAuthenticated}
                    onLogout={handleLogout} // Pass onLogout to AdminProblemPanel (for its internal use if any)
                    onSolveProblem={handleSolveProblemClick}
                />
            )}
            {currentPage === 'dashboard' && (
                <Dashboard
                    userRole={userRole}
                    isAuthenticated={isAuthenticated}
                />
            )}
            {currentPage === 'contests' && (
                <Contests
                    userRole={userRole}
                    isAuthenticated={isAuthenticated}
                />
            )}
            {currentPage === 'submissions' && (
                <SubmissionsList
                    userRole={userRole}
                    isAuthenticated={isAuthenticated}
                />
            )}
        </>
    );
}

export default App;
