import React, { useState, useEffect } from 'react';
import { LogIn, User as UserIcon, Shield, ArrowLeft } from 'lucide-react';

function AuthScreen({ onLogin, onRegister, message }) {
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentAuthMessage, setCurrentAuthMessage] = useState(message);
    const [showLanding, setShowLanding] = useState(true);

    useEffect(() => {
        setCurrentAuthMessage(message);
    }, [message, isLoginMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentAuthMessage('');
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
        setName('');
        setEmail('');
        setPassword('');
        setCurrentAuthMessage('');
    };

    // Custom styles for enhanced visual appeal
    const customStyles = {
        backgroundGradient: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 35%, #0f3460 100%)',
            minHeight: '100vh'
        },
        cardGlass: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.3)'
        },
        btnPrimary: {
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
        },
        btnSuccess: {
            background: 'linear-gradient(45deg, #56ab2f 0%, #a8e6cf 100%)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(86, 171, 47, 0.4)',
            transition: 'all 0.3s ease'
        },
        btnWarning: {
            background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(245, 87, 108, 0.4)',
            transition: 'all 0.3s ease'
        },
        textGradient: {
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        logoPlaceholder: {
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            width: '120px',
            height: '120px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        },
        formControl: {
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            transition: 'all 0.3s ease'
        },
        floatingAnimation: {
            animation: 'float 6s ease-in-out infinite'
        }
    };

    // Landing Screen
    if (showLanding) {
        return (
            <div style={customStyles.backgroundGradient} className="d-flex align-items-center justify-content-center position-relative overflow-hidden">
                {/* Floating background elements */}
                <div 
                    className="position-absolute rounded-circle opacity-25"
                    style={{
                        width: '300px',
                        height: '300px',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        top: '-150px',
                        right: '-150px',
                        filter: 'blur(40px)',
                        animation: 'float 8s ease-in-out infinite'
                    }}
                ></div>
                <div 
                    className="position-absolute rounded-circle opacity-20"
                    style={{
                        width: '250px',
                        height: '250px',
                        background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                        bottom: '-100px',
                        left: '-100px',
                        filter: 'blur(40px)',
                        animation: 'float 10s ease-in-out infinite reverse'
                    }}
                ></div>

                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xl-6">
                            <div 
                                className="card border-0 rounded-4 text-center p-5"
                                style={customStyles.cardGlass}
                            >
                                {/* Logo */}
                          <div className="text-center">
                        <img src="/codevm_logo.svg" alt="AlgoNest Logo" className="auth-logo mb-4" />
                      
                    </div>


                                
                                <div className="d-grid gap-3 col-md-10 col-lg-8 mx-auto">
                                    <button 
                                        onClick={handleUserLoginClick} 
                                        className="btn btn-lg rounded-pill py-3 px-5 d-flex align-items-center justify-content-center fw-bold text-white"
                                        style={customStyles.btnPrimary}
                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <UserIcon size={24} className="me-3" /> User Login
                                    </button>
                                    
                                    <button 
                                        onClick={handleAdminLoginClick} 
                                        className="btn btn-lg rounded-pill py-3 px-5 d-flex align-items-center justify-content-center fw-bold text-white"
                                        style={customStyles.btnSuccess}
                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <Shield size={24} className="me-3" /> Admin Login
                                    </button>
                                    
                                    <button 
                                        onClick={handleRegisterClick} 
                                        className="btn btn-lg rounded-pill py-3 px-5 d-flex align-items-center justify-content-center fw-bold text-white"
                                        style={customStyles.btnWarning}
                                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        <LogIn size={24} className="me-3" /> Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* CSS Animation */}
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(180deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Login/Register screen
    return (
        <div style={customStyles.backgroundGradient} className="d-flex align-items-center justify-content-center position-relative overflow-hidden">
            {/* Floating background elements */}
            <div 
                className="position-absolute rounded-circle opacity-20"
                style={{
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    top: '10%',
                    right: '10%',
                    filter: 'blur(30px)',
                    animation: 'float 8s ease-in-out infinite'
                }}
            ></div>
            <div 
                className="position-absolute rounded-circle opacity-15"
                style={{
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                    bottom: '15%',
                    left: '15%',
                    filter: 'blur(30px)',
                    animation: 'float 10s ease-in-out infinite reverse'
                }}
            ></div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div 
                            className="card border-0 rounded-4 p-4"
                            style={customStyles.cardGlass}
                        >
                            <div className="card-body">
                                <button
                                    className="btn btn-link text-light d-flex align-items-center mb-4 fw-semibold p-0"
                                    onClick={handleBackToLanding}
                                    style={{textDecoration: 'none'}}
                                >
                                    <ArrowLeft size={20} className="me-2" /> Back
                                </button>

                                {/* Logo */}
                               <div className="text-center">
                        <img src="/codevm_logo.svg" alt="AlgoNest Logo" className="auth-logo mb-4" />
                      
                    </div>
                                <h2 className="text-center mb-4 fw-bold" style={customStyles.textGradient}>
                                    {isLoginMode ? 'Login to AlgoNest' : 'Join AlgoNest'}
                                </h2>

                            

                                <form onSubmit={handleSubmit}>
                                    {!isLoginMode && (
                                        <div className="mb-4">
                                            <label htmlFor="name" className="form-label text-light fw-semibold">Name</label>
                                            <input
                                                type="text"
                                                className="form-control rounded-pill py-3 px-4"
                                                style={customStyles.formControl}
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your name"
                                                required
                                                onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)'}
                                                onBlur={(e) => e.target.style.boxShadow = 'none'}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label text-light fw-semibold">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control rounded-pill py-3 px-4"
                                            style={customStyles.formControl}
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)'}
                                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label text-light fw-semibold">Password</label>
                                        <input
                                            type="password"
                                            className="form-control rounded-pill py-3 px-4"
                                            style={customStyles.formControl}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 0.2rem rgba(102, 126, 234, 0.25)'}
                                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                                        />
                                    </div>
                                    
                                    <div className="d-grid mt-4">
                                        <button 
                                            type="submit" 
                                            className="btn btn-lg rounded-pill py-3 fw-bold text-white"
                                            style={customStyles.btnPrimary}
                                            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                                            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                                        >
                                            {isLoginMode ? 'Login' : 'Register'}
                                        </button>
                                    </div>
                                </form>
                                
                                <p className="text-center text-light mt-4 mb-0">
                                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                                    <button
                                        onClick={() => { setIsLoginMode(!isLoginMode); setCurrentAuthMessage(''); }}
                                        className="btn btn-link p-0 border-0 fw-semibold"
                                        style={{color: '#0dcaf0', textDecoration: 'underline'}}
                                    >
                                        {isLoginMode ? 'Register here' : 'Login here'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CSS Animation */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(180deg); }
                }
            `}</style>
        </div>
    );
}

export default AuthScreen;