// backend/routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// --- CRUD Operations for Problems ---

// @route   GET /api/problems
// @desc    Get all problems (Read)
// @access  Private (or protected for authenticated users)
router.get('/', protect, async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.status(200).json(problems);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/problems/:id
// @desc    Get a single problem by ID (Read)
// @access  Private (or protected for authenticated users)
router.get('/:id', protect, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(200).json(problem);
    } catch (error) {
        console.error('Error fetching single problem:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/problems
// @desc    Create a new problem (Create)
// @access  Private (Admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
    const { 
        title, 
        statement, 
        input, 
        output, 
        constraints, 
        timeLimit, 
        memoryLimit, 
        difficulty, 
        tags,
        boilerplateCode 
    } = req.body;

    if (!title || !statement || !input || !output || !constraints || !timeLimit || !memoryLimit || !difficulty) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        const newProblem = new Problem({
            title,
            statement,
            input,
            output,
            constraints,
            timeLimit,
            memoryLimit,
            difficulty,
            tags,
            boilerplateCode: boilerplateCode || {
                cpp: '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n        \n    }\n}',
                python: '# Your code here\n\ndef main():\n    # Read input\n    pass\n\nif __name__ == "__main__":\n    main()'
            }
        });

        const problem = await newProblem.save();
        res.status(201).json(problem);
    } catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PUT /api/problems/:id
// @desc    Update an existing problem (Update)
// @access  Private (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
    const { 
        title, 
        statement, 
        input, 
        output, 
        constraints, 
        timeLimit, 
        memoryLimit, 
        difficulty, 
        tags,
        boilerplateCode 
    } = req.body;

    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        problem.title = title || problem.title;
        problem.statement = statement || problem.statement;
        problem.input = input || problem.input;
        problem.output = output || problem.output;
        problem.constraints = constraints || problem.constraints;
        problem.timeLimit = timeLimit || problem.timeLimit;
        problem.memoryLimit = memoryLimit || problem.memoryLimit;
        problem.difficulty = difficulty || problem.difficulty;
        problem.tags = tags || problem.tags;
        problem.boilerplateCode = boilerplateCode || problem.boilerplateCode;

        const updatedProblem = await problem.save();
        res.status(200).json(updatedProblem);
    } catch (error) {
        console.error('Error updating problem:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/problems/:id
// @desc    Delete a problem (Delete)
// @access  Private (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        await Problem.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Problem removed' });
    } catch (error) {
        console.error('Error deleting problem: ', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
