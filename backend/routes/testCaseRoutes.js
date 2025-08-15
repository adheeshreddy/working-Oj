// backend/routes/testCaseRoutes.js
const express = require('express');
const router = express.Router(); // Note: This router is for test cases specifically
const TestCase = require('../models/TestCase');
const Problem = require('../models/Problem'); // To validate problemId
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// --- CRUD Operations for Test Cases ---

// @route   GET /api/problems/:problemId/testcases
// @desc    Get all test cases for a specific problem (Read) - Admin only
// @access  Private (Admin only)
router.get('/:problemId/testcases', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const problemId = req.params.problemId;
        const testCases = await TestCase.find({ problemId: problemId }).sort({ createdAt: 1 }); // Sort by creation date
        res.status(200).json(testCases);
    } catch (error) {
        console.error(`Error fetching test cases for problem ${req.params.problemId}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/problems/:problemId/testcases/sample
// @desc    Get only sample test cases for a specific problem (Read) - For regular users
// @access  Private (Authenticated users)
router.get('/:problemId/testcases/sample', protect, async (req, res) => {
    try {
        const problemId = req.params.problemId;
        // Get only sample test cases (isHidden: false)
        const sampleTestCases = await TestCase.find({ 
            problemId: problemId, 
            isHidden: false 
        }).sort({ createdAt: 1 });
        res.status(200).json(sampleTestCases);
    } catch (error) {
        console.error(`Error fetching sample test cases for problem ${req.params.problemId}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/problems/:problemId/testcases/:id
// @desc    Get a single test case by ID for a specific problem (Read)
// @access  Private (Admin only)
router.get('/:problemId/testcases/:id', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const testCase = await TestCase.findOne({ _id: req.params.id, problemId: req.params.problemId });
        if (!testCase) {
            return res.status(404).json({ message: 'Test case not found for this problem' });
        }
        res.status(200).json(testCase);
    } catch (error) {
        console.error(`Error fetching single test case ${req.params.id}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/problems/:problemId/testcases
// @desc    Create a new test case for a specific problem (Create)
// @access  Private (Admin only)
router.post('/:problemId/testcases', protect, authorizeRoles('admin'), async (req, res) => {
    const { input, output, isHidden, points } = req.body;
    const problemId = req.params.problemId;

    // Basic validation
    if (!input || !output || points === undefined || points === null) {
        return res.status(400).json({ message: 'Please provide input, output, and points for the test case' });
    }

    try {
        // Ensure the problem exists before adding a test case to it
        const problemExists = await Problem.findById(problemId);
        if (!problemExists) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const newTestCase = new TestCase({
            problemId,
            input,
            output,
            isHidden: isHidden !== undefined ? isHidden : true, // Default to true if not provided
            points,
        });

        const testCase = await newTestCase.save();
        res.status(201).json(testCase); // 201 Created
    } catch (error) {
        console.error(`Error creating test case for problem ${problemId}:`, error, error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/problems/:problemId/testcases/:id
// @desc    Update an existing test case (Update)
// @access  Private (Admin only)
router.put('/:problemId/testcases/:id', protect, authorizeRoles('admin'), async (req, res) => {
    const { input, output, isHidden, points } = req.body;
    const problemId = req.params.problemId; // Ensure it's for the correct problem
    const testCaseId = req.params.id;

    try {
        const testCase = await TestCase.findOne({ _id: testCaseId, problemId: problemId });

        if (!testCase) {
            return res.status(404).json({ message: 'Test case not found for this problem' });
        }

        // Update fields if provided
        testCase.input = input !== undefined ? input : testCase.input;
        testCase.output = output !== undefined ? output : testCase.output;
        testCase.isHidden = isHidden !== undefined ? isHidden : testCase.isHidden;
        testCase.points = points !== undefined ? points : testCase.points;

        const updatedTestCase = await testCase.save();
        res.status(200).json(updatedTestCase);
    } catch (error) {
        console.error(`Error updating test case ${testCaseId}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/problems/:problemId/testcases/:id
// @desc    Delete a test case (Delete)
// @access  Private (Admin only)
router.delete('/:problemId/testcases/:id', protect, authorizeRoles('admin'), async (req, res) => {
    const problemId = req.params.problemId;
    const testCaseId = req.params.id;

    try {
        const testCase = await TestCase.findOne({ _id: testCaseId, problemId: problemId });

        if (!testCase) {
            return res.status(404).json({ message: 'Test case not found for this problem' });
        }

        await TestCase.deleteOne({ _id: testCaseId });
        res.status(200).json({ message: 'Test case removed' });
    } catch (error) {
        console.error(`Error deleting test case ${testCaseId}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
