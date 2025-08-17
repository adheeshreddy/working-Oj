// frontend/src/components/AdminProblemPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    PlusCircle,
    SquarePen,
    Trash,
    Eye,
    User as UserIcon,
    Shield,
    FlaskConical,
    CheckCircle,
    XCircle,
    LogIn,
    LogOut,
    Search,
    Tag,
    Gauge,
    Settings
} from 'lucide-react';

const api_url = import.meta.env.VITE_SERVER;
// Base URL for your backend API
const API_BASE_URL = ` ${api_url}/api/problems`;

function AdminProblemPanel({ userRole, isAuthenticated, onLogout, onSolveProblem }) {
    const [problems, setProblems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [message, setMessage] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [problemToDeleteId, setProblemToDeleteId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Test Case Management States
    const [testCases, setTestCases] = useState([]);
    const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);
    const [currentTestCase, setCurrentTestCase] = useState(null);
    const [testCaseFormMode, setTestCaseFormMode] = useState('create');

    // Test Case Form States
    const [testCaseInput, setTestCaseInput] = useState('');
    const [testCaseOutput, setTestCaseOutput] = useState('');
    const [testCaseIsHidden, setTestCaseIsHidden] = useState(true);
    const [testCasePoints, setTestCasePoints] = useState(0);

    // Problem Form state (existing)
    const [title, setTitle] = useState('');
    const [statement, setStatement] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [constraints, setConstraints] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [memoryLimit, setMemoryLimit] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [tags, setTags] = useState('');

    // Filter state
    const [filterTag, setFilterTag] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProblems();
        } else {
            setProblems([]);
            setMessage("Please log in to view problems.");
        }
    }, [isAuthenticated]);

    const fetchProblems = async () => {
        setIsLoading(true);
        setMessage('');
        console.log(`Attempting to fetch problems from: ${API_BASE_URL}`);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(API_BASE_URL, config);
            setProblems(response.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setMessage(`Failed to fetch problems: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Problem CRUD Handlers (Existing) ---
    const resetProblemForm = () => {
        setTitle('');
        setStatement('');
        setInput('');
        setOutput('');
        setConstraints('');
        setTimeLimit('');
        setMemoryLimit('');
        setDifficulty('Easy');
        setTags('');
        setCurrentProblem(null);
        setMessage('');
    };

    const openCreateProblemModal = () => {
        setFormMode('create');
        resetProblemForm();
        setIsModalOpen(true);
    };

    const openEditProblemModal = (problem) => {
        setFormMode('edit');
        setCurrentProblem(problem);
        setTitle(problem.title);
        setStatement(problem.statement);
        setInput(problem.input);
        setOutput(problem.output);
        setConstraints(problem.constraints);
        setTimeLimit(problem.timeLimit);
        setMemoryLimit(problem.memoryLimit);
        setDifficulty(problem.difficulty);
        setTags(problem.tags.join(', '));
        setIsModalOpen(true);
        fetchTestCases(problem._id);
    };

    const openViewProblemModal = (problem) => {
        setCurrentProblem(problem);
        setIsViewModalOpen(true);
    };

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsViewModalOpen(false);
        setIsConfirmModalOpen(false);
        setIsTestCaseModalOpen(false);
        setProblemToDeleteId(null);
        setCurrentProblem(null);
        resetProblemForm();
        resetTestCaseForm();
        setTestCases([]);
        setMessage('');
    };

    const handleProblemSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const problemData = {
            title,
            statement,
            input,
            output,
            constraints,
            timeLimit: Number(timeLimit),
            memoryLimit: Number(memoryLimit),
            difficulty,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        };

        console.log('Submitting problem data:', problemData);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (formMode === 'create') {
                await axios.post(API_BASE_URL, problemData, config);
                setMessage('Problem created successfully!');
            } else {
                await axios.put(`${API_BASE_URL}/${currentProblem._id}`, problemData, config);
                setMessage('Problem updated successfully!');
            }
            fetchProblems();
            closeAllModals();
        } catch (error) {
            console.error('Error submitting problem:', error);
            setMessage(`Failed to ${formMode} problem: ${error.response?.data?.message || error.message}`);
        }
    };

    const openConfirmDeleteProblemModal = (id) => {
        setProblemToDeleteId(id);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteProblem = async () => {
        if (!problemToDeleteId) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_BASE_URL}/${problemToDeleteId}`, config);
            setMessage('Problem deleted successfully!');
            fetchProblems();
            closeAllModals();
        } catch (error) {
            console.error('Error deleting problem:', error);
            setMessage(`Failed to delete problem: ${error.response?.data?.message || error.message}`);
            closeAllModals();
        }
    };

    // --- Test Case CRUD Handlers (Existing) ---
    const fetchTestCases = async (problemId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/${problemId}/testcases`, config);
            setTestCases(response.data);
        } catch (error) {
            console.error('Error fetching test cases:', error);
            setMessage('Failed to fetch test cases.');
        }
    };

    const resetTestCaseForm = () => {
        setTestCaseInput('');
        setTestCaseOutput('');
        setTestCaseIsHidden(true);
        setTestCasePoints(0);
        setCurrentTestCase(null);
    };

    const openCreateTestCaseModal = () => {
        setTestCaseFormMode('create');
        resetTestCaseForm();
        setIsTestCaseModalOpen(true);
    };

    const openEditTestCaseModal = (testCase) => {
        setTestCaseFormMode('edit');
        setCurrentTestCase(testCase);
        setTestCaseInput(testCase.input);
        setTestCaseOutput(testCase.output);
        setTestCaseIsHidden(testCase.isHidden);
        setTestCasePoints(testCase.points);
        setIsTestCaseModalOpen(true);
    };

    const handleTestCaseSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!currentProblem || !currentProblem._id) {
            setMessage('Error: Select a problem first to manage test cases.');
            return;
        }

        const testCaseData = {
            input: testCaseInput,
            output: testCaseOutput,
            isHidden: testCaseIsHidden,
            points: Number(testCasePoints),
        };

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (testCaseFormMode === 'create') {
                await axios.post(`${API_BASE_URL}/${currentProblem._id}/testcases`, testCaseData, config);
                setMessage('Test case created successfully!');
            } else {
                await axios.put(`${API_BASE_URL}/${currentProblem._id}/testcases/${currentTestCase._id}`, testCaseData, config);
                setMessage('Test case updated successfully!');
            }
            fetchTestCases(currentProblem._id);
            setIsTestCaseModalOpen(false);
            resetTestCaseForm();
        } catch (error) {
            console.error('Error submitting test case:', error);
            setMessage(`Failed to ${testCaseFormMode} test case: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteTestCase = async (testCaseId) => {
        if (!currentProblem || !currentProblem._id) {
            setMessage('Error: Select a problem first to delete test cases.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this test case?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_BASE_URL}/${currentProblem._id}/testcases/${testCaseId}`, config);
                setMessage('Test case deleted successfully!');
                fetchTestCases(currentProblem._id);
            } catch (error) {
                console.error('Error deleting test case:', error);
                setMessage(`Failed to delete test case: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const isAdmin = userRole === 'admin';

    // Filtered problems based on tag input
    const filteredProblems = problems.filter(problem =>
        problem.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())) || filterTag === ''
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 mb-5 rounded-3 border">
                    <h1 className="h4 fw-bold mb-0 d-flex align-items-center text-dark">
                        <Settings size={26} className="me-2 text-primary" /> Problem Management
                    </h1>
                    <p className="text-muted mt-2">
                        {isAdmin ? "Manage problems, test cases, and review submissions." : "Browse and solve coding problems."}
                    </p>
                </header>

                {message && (
                    <div className="alert alert-info rounded-3 mb-4">
                        {message}
                        <button type="button" className="btn-close float-end" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}

                <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h5 fw-semibold text-dark mb-0">All Problems</h2>
                            {isAdmin && (
                                <button
                                    onClick={openCreateProblemModal}
                                    className="btn btn-primary d-flex align-items-center px-4 py-2 fw-semibold rounded-pill"
                                >
                                    <PlusCircle size={18} className="me-2" /> Add New Problem
                                </button>
                            )}
                        </div>

                        {/* Filter by Tags Input */}
                        <div className="mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <Search size={20} className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Filter by tags (e.g., array, dp, hash)"
                                    value={filterTag}
                                    onChange={(e) => setFilterTag(e.target.value)}
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted mt-2">Loading problems...</p>
                            </div>
                        ) : problems.length === 0 ? (
                            <div className="text-center text-muted py-5 border rounded-3 bg-light">
                                <p className="mb-0 fs-6">
                                    {isAuthenticated ? 'No problems found. Start by adding one (if admin) or check back later!' : 'Please log in to view problems.'}
                                </p>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {filteredProblems.map((problem) => (
                                    <div className="col" key={problem._id}>
                                        <div className="card h-100 shadow-sm rounded-3 border">
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title text-dark fw-bold mb-2">{problem.title}</h5>
                                                <div className="d-flex align-items-center mb-3">
                                                    <span className={`badge rounded-pill me-2 ${
                                                        problem.difficulty === 'Easy' ? 'bg-success' :
                                                        problem.difficulty === 'Medium' ? 'bg-warning text-dark' :
                                                        'bg-danger'
                                                    } px-3 py-2`}>
                                                        <Gauge size={14} className="me-1" /> {problem.difficulty}
                                                    </span>
                                                </div>
                                                {problem.tags.length > 0 && (
                                                    <div className="mb-3">
                                                        {problem.tags.map((tag, index) => (
                                                            <span key={index} className="badge bg-light text-dark border me-1 mb-1">
                                                                <Tag size={12} className="me-1" />{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="card-text text-muted small flex-grow-1">
                                                    {problem.statement.substring(0, 100)}...
                                                </p>
                                                <div className="d-flex flex-wrap gap-2 mt-3">
                                                    <button
                                                        onClick={() => openViewProblemModal(problem)}
                                                        className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                                        title="View Problem"
                                                    >
                                                        <Eye size={16} className="me-1" /> View
                                                    </button>
                                                    {isAdmin && (
                                                        <>
                                                            <button
                                                                onClick={() => openEditProblemModal(problem)}
                                                                className="btn btn-outline-warning btn-sm rounded-pill px-3"
                                                                title="Edit Problem"
                                                            >
                                                                <SquarePen size={16} className="me-1" /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => openConfirmDeleteProblemModal(problem._id)}
                                                                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                                                title="Delete Problem"
                                                            >
                                                                <Trash size={16} className="me-1" /> Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    {!isAdmin && isAuthenticated && (
                                                        <button
                                                            onClick={() => onSolveProblem(problem)}
                                                            className="btn btn-success btn-sm rounded-pill px-3 fw-semibold"
                                                            title="Solve Problem"
                                                        >
                                                            Solve
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Problem Create/Edit Modal (Admin Only) */}
                {isModalOpen && isAdmin && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content shadow-lg rounded-3 border">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fw-bold text-dark">
                                        {formMode === 'create' ? 'Create New Problem' : 'Edit Problem'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={closeAllModals} aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleProblemSubmit}>
                                    <div className="modal-body row g-3 p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <div className="col-md-6">
                                            <label htmlFor="title" className="form-label fw-semibold">Title</label>
                                            <input 
                                                type="text" 
                                                id="title" 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)} 
                                                className="form-control rounded-pill" 
                                                required 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="difficulty" className="form-label fw-semibold">Difficulty</label>
                                            <select 
                                                id="difficulty" 
                                                value={difficulty} 
                                                onChange={(e) => setDifficulty(e.target.value)} 
                                                className="form-select rounded-pill" 
                                                required
                                            >
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="statement" className="form-label fw-semibold">Problem Statement</label>
                                            <textarea 
                                                id="statement" 
                                                value={statement} 
                                                onChange={(e) => setStatement(e.target.value)} 
                                                rows="5" 
                                                className="form-control rounded-3" 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="input" className="form-label fw-semibold">Input Format</label>
                                            <textarea 
                                                id="input" 
                                                value={input} 
                                                onChange={(e) => setInput(e.target.value)} 
                                                rows="3" 
                                                className="form-control rounded-3" 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="output" className="form-label fw-semibold">Output Format</label>
                                            <textarea 
                                                id="output" 
                                                value={output} 
                                                onChange={(e) => setOutput(e.target.value)} 
                                                rows="3" 
                                                className="form-control rounded-3" 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="constraints" className="form-label fw-semibold">Constraints</label>
                                            <textarea 
                                                id="constraints" 
                                                value={constraints} 
                                                onChange={(e) => setConstraints(e.target.value)} 
                                                rows="3" 
                                                className="form-control rounded-3" 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="timeLimit" className="form-label fw-semibold">Time Limit (seconds)</label>
                                            <input 
                                                type="number" 
                                                id="timeLimit" 
                                                value={timeLimit} 
                                                onChange={(e) => setTimeLimit(e.target.value)} 
                                                className="form-control rounded-pill" 
                                                required 
                                                min="1" 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="memoryLimit" className="form-label fw-semibold">Memory Limit (MB)</label>
                                            <input 
                                                type="number" 
                                                id="memoryLimit" 
                                                value={memoryLimit} 
                                                onChange={(e) => setMemoryLimit(e.target.value)} 
                                                className="form-control rounded-pill" 
                                                required 
                                                min="1" 
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="tags" className="form-label fw-semibold">Tags (comma-separated)</label>
                                            <input 
                                                type="text" 
                                                id="tags" 
                                                value={tags} 
                                                onChange={(e) => setTags(e.target.value)} 
                                                className="form-control rounded-pill" 
                                                placeholder="e.g., Array, DP, Graph" 
                                            />
                                        </div>

                                        {/* Test Cases Section within Problem Edit Modal */}
                                        {formMode === 'edit' && currentProblem && (
                                            <div className="col-12 mt-4">
                                                <hr className="my-4" />
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h4 className="mb-0 d-flex align-items-center text-primary">
                                                        <FlaskConical size={24} className="me-2" /> Test Cases
                                                    </h4>
                                                    <button 
                                                        onClick={openCreateTestCaseModal} 
                                                        type="button" 
                                                        className="btn btn-success d-flex align-items-center rounded-pill px-3 py-2"
                                                    >
                                                        <PlusCircle size={16} className="me-2" /> Add Test Case
                                                    </button>
                                                </div>
                                                {testCases.length === 0 ? (
                                                    <div className="alert alert-light text-center border rounded-3" role="alert">
                                                        No test cases found for this problem.
                                                    </div>
                                                ) : (
                                                    <div className="table-responsive">
                                                        <table className="table table-hover align-middle border rounded-3">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Input</th>
                                                                    <th>Output</th>
                                                                    <th>Hidden</th>
                                                                    <th>Points</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {testCases.map((tc, index) => (
                                                                    <tr key={tc._id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>
                                                                            <pre className="mb-0 small bg-light p-2 rounded border text-dark" style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                                                {tc.input.length > 50 ? tc.input.substring(0, 50) + '...' : tc.input}
                                                                            </pre>
                                                                        </td>
                                                                        <td>
                                                                            <pre className="mb-0 small bg-light p-2 rounded border text-dark" style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                                                {tc.output.length > 50 ? tc.output.substring(0, 50) + '...' : tc.output}
                                                                            </pre>
                                                                        </td>
                                                                        <td>
                                                                            {tc.isHidden ? 
                                                                                <XCircle size={20} className="text-danger" /> : 
                                                                                <CheckCircle size={20} className="text-success" />
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <span className="badge bg-primary rounded-pill">{tc.points}</span>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex gap-2">
                                                                                <button 
                                                                                    onClick={() => openEditTestCaseModal(tc)} 
                                                                                    type="button" 
                                                                                    className="btn btn-sm btn-outline-warning rounded-pill" 
                                                                                    title="Edit Test Case"
                                                                                >
                                                                                    <SquarePen size={14} />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => handleDeleteTestCase(tc._id)} 
                                                                                    type="button" 
                                                                                    className="btn btn-sm btn-outline-danger rounded-pill" 
                                                                                    title="Delete Test Case"
                                                                                >
                                                                                    <Trash size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" onClick={closeAllModals} className="btn btn-secondary rounded-pill px-4">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
                                            {formMode === 'create' ? 'Create Problem' : 'Update Problem'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Case Create/Edit Modal */}
                {isTestCaseModalOpen && isAdmin && currentProblem && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content shadow-lg rounded-3 border">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fw-bold text-dark">
                                        {testCaseFormMode === 'create' ? 'Add New Test Case' : 'Edit Test Case'} for "{currentProblem.title}"
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setIsTestCaseModalOpen(false)} aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleTestCaseSubmit}>
                                    <div className="modal-body row g-3 p-4">
                                        <div className="col-12">
                                            <label htmlFor="testCaseInput" className="form-label fw-semibold">Input</label>
                                            <textarea 
                                                id="testCaseInput" 
                                                value={testCaseInput} 
                                                onChange={(e) => setTestCaseInput(e.target.value)} 
                                                className="form-control rounded-3" 
                                                required 
                                                rows="5"
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="testCaseOutput" className="form-label fw-semibold">Output</label>
                                            <textarea 
                                                id="testCaseOutput" 
                                                value={testCaseOutput} 
                                                onChange={(e) => setTestCaseOutput(e.target.value)} 
                                                className="form-control rounded-3" 
                                                required 
                                                rows="5"
                                            ></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="testCasePoints" className="form-label fw-semibold">Points</label>
                                            <input 
                                                type="number" 
                                                id="testCasePoints" 
                                                value={testCasePoints} 
                                                onChange={(e) => setTestCasePoints(e.target.value)} 
                                                className="form-control rounded-pill" 
                                                required 
                                                min="0" 
                                            />
                                        </div>
                                        <div className="col-md-6 d-flex align-items-end">
                                            <div className="form-check form-switch">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    id="testCaseIsHidden" 
                                                    checked={testCaseIsHidden} 
                                                    onChange={(e) => setTestCaseIsHidden(e.target.checked)} 
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor="testCaseIsHidden">
                                                    Hidden Test Case
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top">
                                        <button type="button" onClick={() => setIsTestCaseModalOpen(false)} className="btn btn-secondary rounded-pill px-4">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success rounded-pill px-4 fw-semibold">
                                            {testCaseFormMode === 'create' ? 'Add Test Case' : 'Update Test Case'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Problem View Modal (Accessible by both Admin and User) */}
                {isViewModalOpen && currentProblem && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content shadow-lg rounded-3 border">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fw-bold text-dark">{currentProblem.title}</h5>
                                    <button type="button" className="btn-close" onClick={closeAllModals} aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="row mb-4">
                                        <div className="col-md-4">
                                            <p className="mb-1 text-dark"><strong>Difficulty:</strong></p>
                                            <span className={`badge rounded-pill ${
                                                currentProblem.difficulty === 'Easy' ? 'bg-success' :
                                                currentProblem.difficulty === 'Medium' ? 'bg-warning text-dark' :
                                                'bg-danger'
                                            } px-3 py-2`}>
                                                <Gauge size={14} className="me-1" /> {currentProblem.difficulty}
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <p className="mb-1 text-dark"><strong>Time Limit:</strong></p>
                                            <span className="text-primary fw-bold">{currentProblem.timeLimit}</span> seconds
                                        </div>
                                        <div className="col-md-4">
                                            <p className="mb-1 text-dark"><strong>Memory Limit:</strong></p>
                                            <span className="text-primary fw-bold">{currentProblem.memoryLimit}</span> MB
                                        </div>
                                    </div>
                                    
                                    {currentProblem.tags.length > 0 && (
                                        <div className="mb-4">
                                            <p className="mb-2 text-dark"><strong>Tags:</strong></p>
                                            {currentProblem.tags.map((tag, index) => (
                                                <span key={index} className="badge bg-light text-dark border me-2 mb-1">
                                                    <Tag size={12} className="me-1" />{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <hr className="my-4" />
                                    
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-primary mb-2">Problem Statement:</h6>
                                        <div className="bg-light p-3 rounded-3 border">
                                            <pre className="mb-0 text-dark">{currentProblem.statement}</pre>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6 mb-4">
                                            <h6 className="fw-bold text-primary mb-2">Input Format:</h6>
                                            <div className="bg-light p-3 rounded-3 border">
                                                <pre className="mb-0 text-dark">{currentProblem.input}</pre>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <h6 className="fw-bold text-primary mb-2">Output Format:</h6>
                                            <div className="bg-light p-3 rounded-3 border">
                                                <pre className="mb-0 text-dark">{currentProblem.output}</pre>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <h6 className="fw-bold text-primary mb-2">Constraints:</h6>
                                        <div className="bg-light p-3 rounded-3 border">
                                            <pre className="mb-0 text-dark">{currentProblem.constraints}</pre>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        onClick={closeAllModals}
                                        className="btn btn-primary rounded-pill px-4 fw-semibold"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Confirmation Modal for Deletion (Admin Only) */}
                {isConfirmModalOpen && isAdmin && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-sm modal-dialog-centered">
                            <div className="modal-content shadow-lg rounded-3 border">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fw-bold text-danger">Confirm Deletion</h5>
                                    <button type="button" className="btn-close" onClick={closeAllModals} aria-label="Close"></button>
                                </div>
                                <div className="modal-body text-center p-4">
                                    <p className="mb-3 fs-6">Are you sure you want to delete this problem?</p>
                                    <p className="text-danger fw-semibold small">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer border-top">
                                    <button
                                        type="button"
                                        onClick={closeAllModals}
                                        className="btn btn-secondary rounded-pill px-4"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteProblem}
                                        className="btn btn-danger rounded-pill px-4 fw-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminProblemPanel;