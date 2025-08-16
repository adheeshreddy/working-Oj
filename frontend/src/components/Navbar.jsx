// frontend/src/components/Navbar.jsx
import React from 'react';
import { Sun, Moon, User as UserIcon, Shield, LogOut, LogIn, LayoutDashboard, Code, Trophy, ListChecks } from 'lucide-react';

function Navbar({ isAuthenticated, userRole, onLogout, onNavigate, toggleTheme, isDarkMode }) {
    const isAdmin = userRole === 'admin';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow-lg py-3 position-sticky top-0" 
             style={{ 
                 background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                 backdropFilter: 'blur(10px)',
                 WebkitBackdropFilter: 'blur(10px)',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                 zIndex: 1000
             }}>
            <div className="container-fluid px-5">
                <a className="navbar-brand d-flex align-items-center position-relative" 
                   href="#" 
                   onClick={() => onNavigate('problems')}
                   style={{ 
                       transition: 'transform 0.3s ease',
                       cursor: 'pointer'
                   }}
                   onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                   onMouseLeave={e => e.target.style.transform = 'scale(1)'}>
                    <div className="position-relative me-3">
                        <img src="/codevm_logo.svg" 
                             alt="AlgoNest Logo" 
                             className="logo-image" 
                             style={{ 
                                 maxWidth: '38px', 
                                 height: 'auto',
                                 filter: 'drop-shadow(0 0 10px rgba(167, 112, 239, 0.3))',
                                 transition: 'filter 0.3s ease'
                             }} />
                    </div>
                    <span className="fw-bold fs-4 position-relative" 
                          style={{ 
                              background: 'linear-gradient(45deg, #a770ef, #cf8bf3, #fdb99b, #ff6b9d)',
                              backgroundSize: '300% 300%',
                              animation: 'gradient-shift 3s ease-in-out infinite',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              textShadow: '0 0 20px rgba(167, 112, 239, 0.3)'
                          }}>
                        AlgoNest
                    </span>
                </a>
                
                <button className="navbar-toggler border-0" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" 
                        aria-controls="navbarNav" 
                        aria-expanded="false" 
                        aria-label="Toggle navigation"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease'
                        }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated && (
                            <>
                                <li className="nav-item mx-1">
                                    <a className={`nav-link d-flex align-items-center px-3 py-2 rounded-pill position-relative nav-link-enhanced ${userRole === 'admin' ? 'text-info admin-link' : 'text-light'}`} 
                                       href="#" 
                                       onClick={() => onNavigate('dashboard')}
                                       style={{
                                           transition: 'all 0.3s ease',
                                           background: 'rgba(255, 255, 255, 0.05)',
                                           backdropFilter: 'blur(5px)'
                                       }}>
                                        <LayoutDashboard size={18} className="me-2" /> 
                                        <span className="nav-text">Dashboard</span>
                                    </a>
                                </li>
                                <li className="nav-item mx-1">
                                    <a className="nav-link d-flex align-items-center px-3 py-2 rounded-pill position-relative nav-link-enhanced text-light" 
                                       href="#" 
                                       onClick={() => onNavigate('problems')}
                                       style={{
                                           transition: 'all 0.3s ease',
                                           background: 'rgba(255, 255, 255, 0.05)',
                                           backdropFilter: 'blur(5px)'
                                       }}>
                                        <Code size={18} className="me-2" /> 
                                        <span className="nav-text">Problems</span>
                                    </a>
                                </li>
                                <li className="nav-item mx-1">
                                    <a className="nav-link d-flex align-items-center px-3 py-2 rounded-pill position-relative nav-link-enhanced text-light" 
                                       href="#" 
                                       onClick={() => onNavigate('contests')}
                                       style={{
                                           transition: 'all 0.3s ease',
                                           background: 'rgba(255, 255, 255, 0.05)',
                                           backdropFilter: 'blur(5px)'
                                       }}>
                                        <Trophy size={18} className="me-2" /> 
                                        <span className="nav-text">Contests</span>
                                    </a>
                                </li>
                                <li className="nav-item mx-1">
                                    <a className="nav-link d-flex align-items-center px-3 py-2 rounded-pill position-relative nav-link-enhanced text-light" 
                                       href="#" 
                                       onClick={() => onNavigate('submissions')}
                                       style={{
                                           transition: 'all 0.3s ease',
                                           background: 'rgba(255, 255, 255, 0.05)',
                                           backdropFilter: 'blur(5px)'
                                       }}>
                                        <ListChecks size={18} className="me-2" /> 
                                        <span className="nav-text">Submissions</span>
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                    
                    <div className="d-flex align-items-center">
                        {isAuthenticated && (
                            <div className="badge bg-gradient me-3 p-2 rounded-pill d-flex align-items-center position-relative"
                                 style={{
                                     background: isAdmin 
                                         ? 'linear-gradient(45deg, #17a2b8, #20c997)' 
                                         : 'linear-gradient(45deg, #6c757d, #495057)',
                                     border: isAdmin 
                                         ? '1px solid rgba(23, 162, 184, 0.5)' 
                                         : '1px solid rgba(108, 117, 125, 0.5)',
                                     boxShadow: isAdmin 
                                         ? '0 0 15px rgba(23, 162, 184, 0.3)' 
                                         : '0 0 10px rgba(108, 117, 125, 0.2)',
                                     fontSize: '0.85rem',
                                     fontWeight: '600',
                                     letterSpacing: '0.5px',
                                     animation: isAdmin ? 'pulse-admin 2s infinite' : 'none'
                                 }}>
                                {isAdmin ? (
                                    <Shield size={16} className="me-2" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' }} />
                                ) : (
                                    <UserIcon size={16} className="me-2" />
                                )}
                                <span>{userRole.toUpperCase()}</span>
                            </div>
                        )}
                        
                        <button onClick={toggleTheme} 
                                className="btn btn-outline-light rounded-circle me-3 theme-toggle" 
                                style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                            <div style={{ 
                                transition: 'transform 0.5s ease',
                                transform: isDarkMode ? 'rotate(360deg)' : 'rotate(0deg)'
                            }}>
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </div>
                        </button>
                        
                        {isAuthenticated ? (
                            <button onClick={onLogout} 
                                    className="btn btn-outline-danger d-flex align-items-center rounded-pill px-4 py-2 logout-btn"
                                    style={{
                                        border: '2px solid #dc3545',
                                        background: 'rgba(220, 53, 69, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '600',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                <LogOut size={16} className="me-2" /> 
                                <span>Logout</span>
                            </button>
                        ) : (
                            <button onClick={() => alert('Please implement actual navigation to login page or open login modal.')} 
                                    className="btn btn-outline-success d-flex align-items-center rounded-pill px-4 py-2 login-btn"
                                    style={{
                                        border: '2px solid #28a745',
                                        background: 'rgba(40, 167, 69, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '600',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                <LogIn size={16} className="me-2" /> 
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes pulse-admin {
                    0%, 100% { box-shadow: 0 0 15px rgba(23, 162, 184, 0.3); }
                    50% { box-shadow: 0 0 25px rgba(23, 162, 184, 0.6); }
                }
                
                .nav-link-enhanced {
                    position: relative;
                    overflow: hidden;
                }
                
                .nav-link-enhanced::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }
                
                .nav-link-enhanced:hover::before {
                    left: 100%;
                }
                
                .nav-link-enhanced:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                
                .admin-link:hover {
                    background: rgba(23, 162, 184, 0.2) !important;
                    box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3);
                }
                
                .theme-toggle:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    border-color: rgba(255, 255, 255, 0.4) !important;
                    transform: scale(1.1);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }
                
                .logout-btn:hover {
                    background: rgba(220, 53, 69, 0.2) !important;
                    border-color: #dc3545 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
                }
                
                .login-btn:hover {
                    background: rgba(40, 167, 69, 0.2) !important;
                    border-color: #28a745 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
                }
                
                .navbar-toggler:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: scale(1.05);
                }
                
                .logo-image:hover {
                    filter: drop-shadow(0 0 20px rgba(167, 112, 239, 0.6)) !important;
                }
                
                @media (max-width: 991px) {
                    .nav-link-enhanced {
                        margin: 0.25rem 0;
                    }
                    
                    .navbar-nav {
                        padding: 1rem 0;
                    }
                    
                    .d-flex.align-items-center {
                        justify-content: space-between;
                        margin-top: 1rem;
                        padding-top: 1rem;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;