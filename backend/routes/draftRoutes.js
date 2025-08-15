// backend/routes/draftRoutes.js
const express = require('express');
const router = express.Router();
const Draft = require('../models/Draft'); // Import the Draft model
const { protect } = require('../middleware/authMiddleware'); // Protect routes

// @route   POST /api/drafts
// @desc    Save/Update a user's draft code for a specific problem
// @access  Private (Authenticated users only)
router.post('/', protect, async (req, res) => {
    const { problemId, code, language } = req.body;
    const userId = req.user._id; // Get user ID from the protect middleware

    if (!problemId || code === undefined || language === undefined) {
        return res.status(400).json({ message: 'Problem ID, code, and language are required for saving draft.' });
    }

    try {
        // Find and update the draft, or create a new one if it doesn't exist (upsert)
        const draft = await Draft.findOneAndUpdate(
            { userId, problemId }, // Query to find existing draft
            { code, language, lastSaved: Date.now() }, // Data to update/set
            { upsert: true, new: true, setDefaultsOnInsert: true } // Options: create if not found, return new doc, apply defaults
        );
        res.status(200).json({ message: 'Draft saved successfully!', draft });
    } catch (error) {
        console.error('Error saving draft:', error);
        res.status(500).json({ message: 'Server Error saving draft.' });
    }
});

// @route   GET /api/drafts/:problemId
// @desc    Fetch a user's draft code for a specific problem
// @access  Private (Authenticated users only)
router.get('/:problemId', protect, async (req, res) => {
    const { problemId } = req.params;
    const userId = req.user._id;

    try {
        const draft = await Draft.findOne({ userId, problemId });
        if (!draft) {
            return res.status(200).json({ message: 'No draft found.', draft: null });
        }
        res.status(200).json({ message: 'Draft loaded successfully!', draft });
    } catch (error) {
        console.error('Error fetching draft:', error);
        res.status(500).json({ message: 'Server Error fetching draft.' });
    }
});

module.exports = router;
