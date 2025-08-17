import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    XCircle, Code, Send, Play, CheckCircle2, AlertTriangle, Clock, MemoryStick,
    Target, Trophy, Zap, Award, Activity, Calendar, Code2, BarChart, ListChecks,
    TagIcon, Gauge
} from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import ReactMarkdown from 'react-markdown';

// API URLs
const api_url = import.meta.env.VITE_SERVER;
const api_com = import.meta.env.VITE_COMPILER;
const SUBMISSION_API_BASE_URL = `${api_url}/api/submissions`;
const DRAFT_API_BASE_URL = `${api_url}/api/drafts`;
const AI_REVIEW_API_URL = `${api_url}/api/ai-review`;

function SolveProblemScreen({ problem, onClose, isAuthenticated }) {
    // All your existing state variables
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [compileMessage, setCompileMessage] = useState('');
    const [inputStdin, setInputStdin] = useState('');
    const [outputStdout, setOutputStdout] = useState('');
    const [activeTab, setActiveTab] = useState('test');
    const [finalVerdict, setFinalVerdict] = useState('Pending');
    const [executionTime, setExecutionTime] = useState(0);
    const [memoryUsed, setMemoryUsed] = useState(0);
    const [isRunningCustomTest, setIsRunningCustomTest] = useState(false);
    const [isRunningSampleTest, setIsRunningSampleTest] = useState(false);
    const [verdicts, setVerdicts] = useState([]);
    const [totalTime, setTotalTime] = useState(null);
    const [testResults, setTestResults] = useState([]);
    const [sampleTestCases, setSampleTestCases] = useState([]);
    const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);
    const [aiReviewContent, setAiReviewContent] = useState('');
    const [isAIRunning, setIsAIRunning] = useState(false);
    const [isLanguageChanging, setIsLanguageChanging] = useState(false);

    // Resizable panel states
    const [leftPanelWidth, setLeftPanelWidth] = useState(45); // percentage
    const [bottomPanelHeight, setBottomPanelHeight] = useState(35); // percentage
    const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
    const [isResizingVertical, setIsResizingVertical] = useState(false);
    
    const containerRef = useRef(null);

    // Load sample test cases when component mounts
    useEffect(() => {
        const loadSampleTestCases = async () => {
            if (!problem || !problem._id) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${api_url}/api/problems/${problem._id}/testcases/sample`, config);
                setSampleTestCases(response.data);
            } catch (error) {
                console.error('Error loading sample test cases:', error);
            }
        };
        loadSampleTestCases();
    }, [problem]);

    // --- Draft Persistence Logic ---
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const saveDraft = useCallback(debounce(async (currentCode, currentLanguage, currentProblemId) => {
        if (!isAuthenticated || !currentCode || !currentProblemId) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(DRAFT_API_BASE_URL, {
                problemId: currentProblemId,
                code: currentCode,
                language: currentLanguage,
            }, config);
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }, 1000), [isAuthenticated]);

    useEffect(() => {
        const loadDraft = async () => {
            if (!isAuthenticated || !problem || !problem._id || isLanguageChanging) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${DRAFT_API_BASE_URL}/${problem._id}`, config);
                if (response.data.draft) {
                    setCode(response.data.draft.code);
                    setLanguage(response.data.draft.language);
                } else if (problem.boilerplateCode && problem.boilerplateCode[language]) {
                    setCode(problem.boilerplateCode[language]);
                }
            } catch (error) {
                console.error('Error loading draft:', error);
                if (problem.boilerplateCode && problem.boilerplateCode[language]) {
                    setCode(problem.boilerplateCode[language]);
                }
            }
        };
        loadDraft();
    }, [isAuthenticated, problem]);

    useEffect(() => {
        if (isAuthenticated && problem && problem._id && (code !== '' || language !== 'cpp')) {
            saveDraft(code, language, problem._id);
        }
    }, [code, language, problem, isAuthenticated, saveDraft]);

    useEffect(() => {
        if (problem && problem.boilerplateCode && problem.boilerplateCode[language]) {
            if (!code || code.trim() === '') {
                setCode(problem.boilerplateCode[language]);
            }
        }
    }, [language, problem]);

    // --- Resizing Logic ---
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isResizingHorizontal && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
                setLeftPanelWidth(Math.max(20, Math.min(80, newWidth)));
            }
            
            if (isResizingVertical && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const rightPanel = containerRef.current.querySelector('.right-panel');
                const rightPanelRect = rightPanel.getBoundingClientRect();
                const relativeY = e.clientY - rightPanelRect.top;
                const newHeight = ((rightPanelRect.height - relativeY) / rightPanelRect.height) * 100;
                setBottomPanelHeight(Math.max(20, Math.min(80, newHeight)));
            }
        };

        const handleMouseUp = () => {
            setIsResizingHorizontal(false);
            setIsResizingVertical(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };

        if (isResizingHorizontal || isResizingVertical) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = isResizingHorizontal ? 'col-resize' : 'row-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizingHorizontal, isResizingVertical]);

    // --- Event Handlers (keep all your existing handlers) ---
    const handleLanguageChange = (newLanguage) => {
        setIsLanguageChanging(true);
        setLanguage(newLanguage);
        if (problem && problem.boilerplateCode && problem.boilerplateCode[newLanguage]) {
            setCode(problem.boilerplateCode[newLanguage]);
        } else {
            setCode('');
        }
        setTimeout(() => setIsLanguageChanging(false), 100);
    };

    const handleRunCode = async () => {
        setCompileMessage('');
        setOutputStdout('');
        setTestResults([]);
        setSubmissionMessage('');
        setIsRunningSampleTest(true);
        setActiveTab('test');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const response = await axios.post(`${SUBMISSION_API_BASE_URL}/run-sample`, {
                problemId: problem._id,
                code: code,
                language: language
            }, config);

            const data = response.data;
            setTestResults(data.verdicts || []);
            
            if (data.verdicts && data.verdicts.length > 0) {
                const firstResult = data.verdicts[0];
                setOutputStdout(firstResult.actualOutput || '');
                setCompileMessage(firstResult.compileMessage || '');
            }
            
            setSubmissionMessage(`Sample test cases executed! Passed: ${data.passedTestCases}/${data.totalTestCases}`);
        } catch (error) {
            console.error('Sample test execution error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data?.compileMessage || 'Error during sample test execution.';
            
            if (error.response?.data?.verdict === 'Time Limit Exceeded') {
                setCompileMessage('Time Limit Exceeded (TLE)');
                setOutputStdout('Your code took too long to execute. Check for infinite loops or inefficient algorithms.');
            } else if (error.response?.data?.verdict === 'Compilation Error') {
                setCompileMessage('Compilation Error');
                setOutputStdout(errorMessage);
            } else if (error.response?.data?.verdict === 'Runtime Error') {
                setCompileMessage('Runtime Error');
                setOutputStdout(errorMessage);
            } else {
                setCompileMessage('Execution Failed');
                setOutputStdout(errorMessage);
            }
            setSubmissionMessage('Sample test execution failed');
        } finally {
            setIsRunningSampleTest(false);
        }
    };

    const handleCustomRun = async () => {
        setCompileMessage('');
        setOutputStdout('');
        setTestResults([]);
        setSubmissionMessage('');
        setIsRunningCustomTest(true);
        setActiveTab('customTest');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const response = await axios.post(`${SUBMISSION_API_BASE_URL}/run-custom`, {
                code: code,
                language: language,
                customInput: inputStdin
            }, config);

            const data = response.data;
            setOutputStdout(data.output || '');
            setCompileMessage(data.compileMessage || '');
            setSubmissionMessage('Custom test executed successfully!');
        } catch (error) {
            console.error('Custom test execution error:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data?.compileMessage || 'Error during custom test execution.';
            
            if (error.response?.data?.verdict === 'Time Limit Exceeded') {
                setCompileMessage('Time Limit Exceeded (TLE)');
                setOutputStdout('Your code took too long to execute. Check for infinite loops or inefficient algorithms.');
            } else if (error.response?.data?.verdict === 'Compilation Error') {
                setCompileMessage('Compilation Error');
                setOutputStdout(errorMessage);
            } else if (error.response?.data?.verdict === 'Runtime Error') {
                setCompileMessage('Runtime Error');
                setOutputStdout(errorMessage);
            } else {
                setCompileMessage('Execution Failed');
                setOutputStdout(errorMessage);
            }
            setSubmissionMessage('Custom test execution failed');
        } finally {
            setIsRunningCustomTest(false);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setSubmissionMessage('');
        setIsSubmitting(true);
        setCompileMessage('');
        setOutputStdout('');
        setFinalVerdict('Pending...');
        setExecutionTime(0);
        setMemoryUsed(0);
        setVerdicts([]);
        setTotalTime(null);
        setActiveTab('verdict');

        const submissionData = { problemId: problem._id, code, language };

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(SUBMISSION_API_BASE_URL, submissionData, config);

            const data = response.data;
            setSubmissionMessage(`Submission evaluated!`);
            setFinalVerdict(data.verdict);
            setExecutionTime(data.executionTime || 0);
            setMemoryUsed(data.memoryUsed || 0);
            setTotalTime(data.executionTime || 0);
            setVerdicts(data.verdicts && Array.isArray(data.verdicts) ? data.verdicts : []);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setSubmissionMessage(`Submission failed: ${errorMessage}`);
            setFinalVerdict('Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetAIReview = async () => {
        setAiReviewContent('');
        setIsAIRunning(true);
        setActiveTab('aiReview');

        const reviewData = {
            userCode: code,
            language: language,
            problemId: problem?._id,
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            const response = await axios.post(AI_REVIEW_API_URL, reviewData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data && response.data.review) {
                setAiReviewContent(response.data.review);
                
                if (response.data.isMock) {
                    console.log('Mock AI review generated. Add your Google Gemini API key for real reviews.');
                }
            } else {
                setAiReviewContent('AI review could not be generated. The response from the server was empty.');
            }
        } catch (error) {
            console.error('Error fetching AI review from backend:', error);
            
            if (error.response?.status === 401) {
                setAiReviewContent('Error: Authentication failed. Please login again.');
            } else if (error.response?.status === 400 && error.response?.data?.error === 'Missing API key') {
                setAiReviewContent('Error: Google Gemini API key is not configured. Please contact the administrator.');
            } else if (error.response?.status === 429) {
                setAiReviewContent('Error: Rate limit exceeded. Please try again in a few minutes.');
            } else if (error.response?.status === 408) {
                setAiReviewContent('Error: Request timeout. The AI service is taking too long to respond.');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to get AI review. Please try again.';
                setAiReviewContent(`Error: ${errorMessage}`);
            }
        } finally {
            setIsAIRunning(false);
        }
    };

    const getLanguageExtension = (lang) => {
        switch (lang) {
            case 'cpp': return cpp();
            case 'java': return java();
            case 'python': return python();
            default: return cpp();
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

    const currentSampleInput = sampleTestCases.length > 0 ? sampleTestCases[currentTestCaseIndex]?.input : "No sample input available.";

    if (!problem) {
        return (
            <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}></div>
                    <h4 className="text-dark mb-2">Loading Problem</h4>
                    <p className="text-muted">Please wait while we fetch the problem data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-bottom">
                <div className="container-fluid px-4 py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <BarChart size={24} className="text-primary me-2" />
                            <h1 className="h5 fw-bold mb-0 text-dark">
                                AlgoNest IDE
                            </h1>
                            <span className="text-muted mx-2">•</span>
                            <h2 className="h6 mb-0 text-dark">{problem.title}</h2>
                            <span className={`badge ms-3 ${
                                problem.difficulty === 'Easy' ? 'bg-success' :
                                problem.difficulty === 'Medium' ? 'bg-warning text-dark' : 
                                'bg-danger'
                            }`}>
                                {problem.difficulty}
                            </span>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="btn btn-outline-secondary d-flex align-items-center rounded-pill px-3 py-2"
                        >
                            <XCircle size={16} className="me-2" /> Back to Problems
                        </button>
                    </div>
                </div>
            </header>

            {/* Main IDE Container */}
            <div 
                ref={containerRef}
                className="d-flex"
                style={{ height: 'calc(100vh - 80px)' }}
            >
                {/* Left Panel - Problem Statement */}
                <div 
                    className="left-panel bg-white border-end shadow-sm"
                    style={{ width: `${leftPanelWidth}%`, minWidth: '300px' }}
                >
                    <div className="h-100 d-flex flex-column">
                        <div className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                            <div className="d-flex align-items-center mb-3">
                                <Target size={20} className="text-primary me-2" />
                                <h4 className="fw-bold mb-0 text-dark">{problem.title}</h4>
                            </div>
                            
                            <div className="d-flex align-items-center mb-4">
                                <span className="text-muted small me-3">
                                    <Clock size={16} className="me-1" />
                                    Time Limit: {problem.timeLimit}s
                                </span>
                                <span className="text-muted small">
                                    <MemoryStick size={16} className="me-1" />
                                    Memory: {problem.memoryLimit}MB
                                </span>
                            </div>

                            <div className="mb-4">
                                {problem.tags && problem.tags.map((tag, index) => (
                                    <span key={index} className="badge bg-light text-dark border me-2 mb-2">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-semibold text-primary mb-2 d-flex align-items-center">
                                    <ListChecks size={16} className="me-2" />
                                    Problem Statement
                                </h6>
                                <div className="bg-light p-3 rounded-3 border">
                                    <p className="text-dark mb-0">{problem.statement}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-semibold text-primary mb-2">Input Format</h6>
                                <div className="bg-light p-3 rounded-3 border">
                                    <p className="text-dark mb-0">{problem.input}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-semibold text-primary mb-2">Output Format</h6>
                                <div className="bg-light p-3 rounded-3 border">
                                    <p className="text-dark mb-0">{problem.output}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-semibold text-primary mb-2">Constraints</h6>
                                <div className="bg-light p-3 rounded-3 border">
                                    <pre className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                        {problem.constraints}
                                    </pre>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h6 className="fw-semibold text-primary mb-2">Constraints</h6>
                                <div className="bg-light p-3 rounded-3 border">
                                    <pre className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                        {problem.constraints}
                                    </pre>
                                </div>
                            </div>

                            {/* Sample Test Cases Section */}
                            {sampleTestCases.length > 0 && (
                                <div className="mb-4">
                                    <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center">
                                        <ListChecks size={16} className="me-2" />
                                        Sample Test Cases
                                    </h6>
                                    {sampleTestCases.map((testCase, index) => (
                                        <div key={index} className="card border shadow-sm mb-3">
                                            <div className="card-body p-3">
                                                <h6 className="fw-semibold text-secondary mb-2 small">
                                                    Sample Test Case {index + 1}
                                                </h6>
                                                
                                                <div className="mb-3">
                                                    <div className="fw-semibold small text-dark mb-1">Input:</div>
                                                    <pre className="bg-light p-2 rounded-2 border mb-0 small" style={{ 
                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                        fontSize: '13px',
                                                        whiteSpace: 'pre-wrap'
                                                    }}>
                                                        {testCase.input}
                                                    </pre>
                                                </div>
                                                
                                                <div>
                                                    <div className="fw-semibold small text-dark mb-1">Expected Output:</div>
                                                    <pre className="bg-light p-2 rounded-2 border mb-0 small" style={{ 
                                                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                                        fontSize: '13px',
                                                        whiteSpace: 'pre-wrap'
                                                    }}>
                                                        {testCase.output}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>

                {/* Horizontal Resizer */}
                <div 
                    className="resizer-horizontal"
                    style={{
                        width: '4px',
                        backgroundColor: '#e2e8f0',
                        cursor: 'col-resize',
                        position: 'relative',
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseDown={() => setIsResizingHorizontal(true)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                >
                    <div 
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20px',
                            height: '40px',
                            backgroundColor: '#cbd5e1',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div style={{
                            width: '2px',
                            height: '20px',
                            backgroundColor: '#64748b',
                            marginRight: '2px'
                        }}></div>
                        <div style={{
                            width: '2px',
                            height: '20px',
                            backgroundColor: '#64748b'
                        }}></div>
                    </div>
                </div>

                {/* Right Panel - Code Editor and Console */}
                <div className="right-panel d-flex flex-column" style={{ width: `${100 - leftPanelWidth}%` }}>
                    {/* Code Editor Section */}
                    <div 
                        className="editor-section bg-white border-bottom shadow-sm"
                        style={{ height: `${100 - bottomPanelHeight}%` }}
                    >
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                            <div className="d-flex align-items-center">
                                <Code2 size={18} className="text-primary me-2" />
                                <span className="fw-semibold text-dark">Code Editor</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={language}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="cpp">C++</option>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                </select>
                                <button
                                    onClick={handleRunCode}
                                    className="btn btn-outline-info btn-sm d-flex align-items-center rounded-pill px-3"
                                    disabled={isSubmitting || isRunningCustomTest || isRunningSampleTest || isAIRunning}
                                >
                                    {isRunningSampleTest ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <Play size={14} className="me-1" /> Run
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCodeSubmit}
                                    className="btn btn-success btn-sm d-flex align-items-center rounded-pill px-3"
                                    disabled={isSubmitting || isRunningCustomTest || isRunningSampleTest || isAIRunning}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} className="me-1" /> Submit
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleGetAIReview}
                                    className="btn btn-outline-primary btn-sm d-flex align-items-center rounded-pill px-3"
                                    disabled={isSubmitting || isRunningCustomTest || isRunningSampleTest || isAIRunning || !code}
                                >
                                    {isAIRunning ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                            Getting Review...
                                        </>
                                    ) : (
                                        <>
                                            <Code size={14} className="me-1" /> AI Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div style={{ height: 'calc(100% - 65px)' }}>
                            <CodeMirror
                                value={code}
                                theme={okaidia}
                                extensions={[getLanguageExtension(language)]}
                                onChange={(value) => setCode(value)}
                                height="100%"
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Vertical Resizer */}
                    <div 
                        className="resizer-vertical"
                        style={{
                            height: '4px',
                            backgroundColor: '#e2e8f0',
                            cursor: 'row-resize',
                            position: 'relative',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseDown={() => setIsResizingVertical(true)}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                    >
                        <div 
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '40px',
                                height: '20px',
                                backgroundColor: '#cbd5e1',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '2px',
                                backgroundColor: '#64748b',
                                marginBottom: '1px'
                            }}></div>
                            <div style={{
                                width: '20px',
                                height: '2px',
                                backgroundColor: '#64748b',
                                marginTop: '1px'
                            }}></div>
                        </div>
                    </div>

                    {/* Console Section */}
                    <div 
                        className="console-section bg-white shadow-sm"
                        style={{ height: `${bottomPanelHeight}%` }}
                    >
                        <div className="h-100 d-flex flex-column">
                            {/* Console Tabs */}
                            <div className="bg-light border-bottom">
                                <ul className="nav nav-tabs border-0 px-3">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link border-0 fw-semibold ${activeTab === 'test' ? 'active bg-white text-primary' : 'text-muted'}`}
                                            onClick={() => setActiveTab('test')}
                                        >
                                            Test Cases
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link border-0 fw-semibold ${activeTab === 'customTest' ? 'active bg-white text-primary' : 'text-muted'}`}
                                            onClick={() => setActiveTab('customTest')}
                                        >
                                            Custom Input
                                        </button>
                                    </li>
                                   
<li className="nav-item">
    <button 
        className={`nav-link border-0 fw-semibold ${activeTab === 'verdict' ? 'active bg-white text-primary' : 'text-muted'}`}
        onClick={() => setActiveTab('verdict')}
    >
        Verdict
    </button>
</li>
                                   <li className="nav-item">
                                       <button 
                                           className={`nav-link border-0 fw-semibold ${activeTab === 'aiReview' ? 'active bg-white text-primary' : 'text-muted'}`}
                                           onClick={() => setActiveTab('aiReview')}
                                       >
                                           AI Review
                                       </button>
                                   </li>
                               </ul>
                           </div>

                           {/* Console Content */}
                           <div className="flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                               {activeTab === 'test' && (
                                   <div>
                                       {sampleTestCases.length > 0 && (
                                           <div className="d-flex gap-2 mb-3">
                                               {sampleTestCases.map((_, index) => (
                                                   <button
                                                       key={index}
                                                       className={`btn btn-sm rounded-pill ${index === currentTestCaseIndex ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                       onClick={() => setCurrentTestCaseIndex(index)}
                                                   >
                                                       Test {index + 1}
                                                   </button>
                                               ))}
                                           </div>
                                       )}
                                       
                                       <div className="card shadow-sm border-0 rounded-3 mb-3">
                                           <div className="card-body p-3">
                                               <h6 className="fw-semibold text-primary mb-2 d-flex align-items-center">
                                                   <Code2 size={16} className="me-2" />
                                                   Input (stdin)
                                               </h6>
                                               <pre className="bg-light p-3 rounded-3 border mb-0 small">{currentSampleInput}</pre>
                                           </div>
                                       </div>

                                       <div className="card shadow-sm border-0 rounded-3 mb-3">
                                           <div className="card-body p-3">
                                               <h6 className="fw-semibold text-primary mb-2 d-flex align-items-center">
                                                   <Activity size={16} className="me-2" />
                                                   Your Output (stdout)
                                               </h6>
                                               <pre className="bg-light p-3 rounded-3 border mb-0 small">
                                                   {outputStdout || "Run code to see output..."}
                                               </pre>
                                           </div>
                                       </div>

                                       {compileMessage && (
                                           <div className="card shadow-sm border-0 rounded-3 mb-3">
                                               <div className="card-body p-3">
                                                   <h6 className="fw-semibold text-warning mb-2 d-flex align-items-center">
                                                       <AlertTriangle size={16} className="me-2" />
                                                       Compilation/Execution Message
                                                   </h6>
                                                   <pre className="bg-warning bg-opacity-10 p-3 rounded-3 border border-warning mb-0 small text-warning">
                                                       {compileMessage}
                                                   </pre>
                                               </div>
                                           </div>
                                       )}

                                       {testResults.length > 0 && (
                                           <div className="card shadow-sm border-0 rounded-3">
                                               <div className="card-body p-3">
                                                   <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center">
                                                       <ListChecks size={16} className="me-2" />
                                                       Test Results
                                                   </h6>
                                                   {testResults.map((result, index) => (
                                                       <div key={index} className={`d-flex justify-content-between align-items-center p-3 rounded-3 mb-2 ${result.status === 'Passed' ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'}`}>
                                                           <span className={`fw-semibold d-flex align-items-center ${result.status === 'Passed' ? 'text-success' : 'text-danger'}`}>
                                                               {result.status === 'Passed' ? <CheckCircle2 size={16} className="me-2" /> : <XCircle size={16} className="me-2" />}
                                                               Test Case {index + 1}
                                                           </span>
                                                           <div className="d-flex align-items-center gap-3">
                                                               <span className="small text-muted d-flex align-items-center">
                                                                   <Clock size={14} className="me-1" />
                                                                   {result.executionTime || 0} ms
                                                               </span>
                                                               <span className="small text-muted d-flex align-items-center">
                                                                   <MemoryStick size={14} className="me-1" />
                                                                   {result.memoryUsed || 0} MB
                                                               </span>
                                                           </div>
                                                       </div>
                                                   ))}
                                               </div>
                                           </div>
                                       )}

                                       {submissionMessage && (
                                           <div className={`alert ${testResults.some(r => r.status === 'Passed') ? 'alert-success' : 'alert-info'} rounded-3 mt-3`}>
                                               {submissionMessage}
                                           </div>
                                       )}
                                   </div>
                               )}

                               {activeTab === 'customTest' && (
                                   <div>
                                       <div className="card shadow-sm border-0 rounded-3 mb-3">
                                           <div className="card-body p-3">
                                               <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center">
                                                   <Code2 size={16} className="me-2" />
                                                   Your Custom Input
                                               </h6>
                                               <textarea
                                                   className="form-control rounded-3 border"
                                                   rows="4"
                                                   value={inputStdin}
                                                   onChange={(e) => setInputStdin(e.target.value)}
                                                   placeholder="Enter custom input here..."
                                                   style={{fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', fontSize: '14px'}}
                                               />
                                               <button 
                                                   onClick={handleCustomRun} 
                                                   className="btn btn-info mt-3 d-flex align-items-center rounded-pill px-3"
                                                   disabled={isRunningCustomTest}
                                               >
                                                   {isRunningCustomTest ? (
                                                       <>
                                                           <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                                           Running...
                                                       </>
                                                   ) : (
                                                       <>
                                                           <Play size={14} className="me-1" />
                                                           Run with Custom Input
                                                       </>
                                                   )}
                                               </button>
                                           </div>
                                       </div>

                                       {outputStdout && (
                                           <div className="card shadow-sm border-0 rounded-3 mb-3">
                                               <div className="card-body p-3">
                                                   <h6 className="fw-semibold text-primary mb-2 d-flex align-items-center">
                                                       <Activity size={16} className="me-2" />
                                                       Your Output (stdout)
                                                   </h6>
                                                   <pre className="bg-light p-3 rounded-3 border mb-0 small">{outputStdout}</pre>
                                               </div>
                                           </div>
                                       )}

                                       {compileMessage && (
                                           <div className="card shadow-sm border-0 rounded-3">
                                               <div className="card-body p-3">
                                                   <h6 className="fw-semibold text-warning mb-2 d-flex align-items-center">
                                                       <AlertTriangle size={16} className="me-2" />
                                                       Compilation/Execution Message
                                                   </h6>
                                                   <pre className="bg-warning bg-opacity-10 p-3 rounded-3 border border-warning mb-0 small text-warning">
                                                       {compileMessage}
                                                   </pre>
                                               </div>
                                           </div>
                                       )}

                                       {submissionMessage && (
                                           <div className="alert alert-info rounded-3 mt-3">
                                               {submissionMessage}
                                           </div>
                                       )}
                                   </div>
                               )}

                               {activeTab === 'verdict' && (
                                   <div>
                                       {submissionMessage && (
                                           <div className="card shadow-sm border-0 rounded-3 mb-3">
                                               <div className="card-body p-3">
                                                   <div className={`alert d-flex justify-content-between align-items-center mb-0 ${
                                                       finalVerdict === 'Accepted' ? 'alert-success' : 
                                                       finalVerdict === 'Pending...' ? 'alert-info' : 'alert-danger'
                                                   }`}>
                                                       <div className="d-flex align-items-center">
                                                           {finalVerdict === 'Accepted' ? (
                                                               <CheckCircle2 size={20} className="me-2 text-success" />
                                                           ) : finalVerdict === 'Pending...' ? (
                                                               <Clock size={20} className="me-2 text-info" />
                                                           ) : (
                                                               <XCircle size={20} className="me-2 text-danger" />
                                                           )}
                                                           <strong className="h6 mb-0">{finalVerdict}</strong>
                                                       </div>
                                                       <div className="d-flex align-items-center gap-3">
                                                           <span className="small text-muted d-flex align-items-center">
                                                               <Clock size={14} className="me-1" />
                                                               {totalTime || 0} ms
                                                           </span>
                                                           <span className="small text-muted d-flex align-items-center">
                                                               <MemoryStick size={14} className="me-1" />
                                                               {memoryUsed || 0} MB
                                                           </span>
                                                       </div>
                                                   </div>
                                               </div>
                                           </div>
                                       )}

                                       {verdicts.length > 0 ? (
                                           <div className="card shadow-sm border-0 rounded-3">
                                               <div className="card-body p-3">
                                                   <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center">
                                                       <ListChecks size={16} className="me-2" />
                                                       Detailed Test Results
                                                   </h6>
                                                   {verdicts.map((v, index) => (
                                                       <div key={index} className={`d-flex justify-content-between align-items-center p-3 rounded-3 mb-2 ${v.status === 'Passed' ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'}`}>
                                                           <span className={`fw-semibold d-flex align-items-center ${v.status === 'Passed' ? 'text-success' : 'text-danger'}`}>
                                                               {v.status === 'Passed' ? <CheckCircle2 size={16} className="me-2" /> : <XCircle size={16} className="me-2" />}
                                                               Test Case {index + 1} {v.isHidden ? '(Hidden)' : '(Sample)'}
                                                           </span>
                                                           <div className="d-flex align-items-center gap-3">
                                                               <span className="small text-muted d-flex align-items-center">
                                                                   <Clock size={14} className="me-1" />
                                                                   {v.executionTime || 0} ms
                                                               </span>
                                                               <span className="small text-muted d-flex align-items-center">
                                                                   <MemoryStick size={14} className="me-1" />
                                                                   {v.memoryUsed || 0} MB
                                                               </span>
                                                           </div>
                                                       </div>
                                                   ))}
                                               </div>
                                           </div>
                                       ) : (
                                           <div className="text-center py-5">
                                               <Target size={48} className="text-muted mb-3 opacity-50" />
                                               <h6 className="text-muted">No Verdict Yet</h6>
                                               <p className="small text-muted">Submit your code to see the verdict and detailed results.</p>
                                           </div>
                                       )}
                                   </div>
                               )}

                               {activeTab === 'aiReview' && (
                                   <div>
                                       <div className="card shadow-sm border-0 rounded-3">
                                           <div className="card-body p-3">
                                               <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center">
                                                   <Code size={16} className="me-2" />
                                                   AI Code Review
                                               </h6>
                                               {isAIRunning ? (
                                                   <div className="text-center py-4">
                                                       <div className="spinner-border text-primary mb-3" role="status"></div>
                                                       <p className="text-muted">Getting AI review, please wait...</p>
                                                   </div>
                                               ) : aiReviewContent ? (
                                                   <div className="markdown-content">
                                                       <ReactMarkdown>{aiReviewContent}</ReactMarkdown>
                                                   </div>
                                               ) : (
                                                   <div className="text-center py-5">
                                                       <Code2 size={48} className="text-muted mb-3 opacity-50" />
                                                       <h6 className="text-muted">No AI Review Yet</h6>
                                                       <p className="small text-muted">Click 'Get AI Review' to analyze your code with AI assistance.</p>
                                                   </div>
                                               )}
                                           </div>
                                       </div>
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

export default SolveProblemScreen;