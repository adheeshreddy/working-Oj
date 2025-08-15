// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const jwt = require('jsonwebtoken');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const generateToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            userType: 'user',
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                userType: newUser.userType,
                token: generateToken(newUser._id, newUser.userType),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
                token: generateToken(user._id, user.userType),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:userId/stats', protect, async (req, res) => {
    if (req.params.userId !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view other user\'s stats' });
    }

    try {
        const userId = req.params.userId;
        const submissions = await Submission.find({ userId });

        let totalSubmissions = submissions.length;
        let acceptedSubmissions = submissions.filter(sub => sub.verdict === 'Accepted').length;
        let solvedProblemsCount = new Set(submissions.filter(sub => sub.verdict === 'Accepted').map(sub => sub.problemId.toString())).size;

        const acceptedProblemIds = [...new Set(submissions.filter(sub => sub.verdict === 'Accepted').map(sub => sub.problemId))];
        const solvedProblems = await Problem.find({ _id: { $in: acceptedProblemIds } }).select('difficulty');

        const difficultyStats = {
            Easy: solvedProblems.filter(p => p.difficulty === 'Easy').length,
            Medium: solvedProblems.filter(p => p.difficulty === 'Medium').length,
            Hard: solvedProblems.filter(p => p.difficulty === 'Hard').length,
        };

        const allSolvedProblemsWithTags = await Problem.find({ _id: { $in: acceptedProblemIds } }).select('tags');
        const tagStats = {};
        allSolvedProblemsWithTags.forEach(p => {
            p.tags.forEach(tag => {
                tagStats[tag] = (tagStats[tag] || 0) + 1;
            });
        });


        res.status(200).json({
            totalSubmissions,
            acceptedSubmissions,
            solvedProblemsCount,
            difficultyStats,
            tagStats,
        });

    } catch (error) {
        console.error(`Error fetching stats for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Server Error fetching stats.' });
    }
});

router.get('/:userId/recent-submissions', protect, async (req, res) => {
    if (req.params.userId !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view other user\'s recent submissions' });
    }

    try {
        const userId = req.params.userId;
        const recentSubmissions = await Submission.find({ userId })
                                                .populate('problemId', 'title difficulty')
                                                .sort({ submittedAt: -1 })
                                                .limit(5);

        res.status(200).json(recentSubmissions);

    } catch (error) {
        console.error(`Error fetching recent submissions for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Server Error fetching recent submissions.' });
    }
});

router.get('/:userId/activity', protect, async (req, res) => {
    if (req.params.userId !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view other user\'s activity' });
    }

    try {
        const recentSubmissions = await Submission.find({ userId: req.params.userId })
                                                .populate('problemId', 'title')
                                                .sort({ submittedAt: -1 })
                                                .limit(5);

        const activity = recentSubmissions.map(sub => ({
            type: 'Submission',
            description: `Submitted solution for "${sub.problemId.title}" with verdict: ${sub.verdict}.`,
            timestamp: sub.submittedAt,
        }));

        res.status(200).json(activity);

    } catch (error) {
        console.error(`Error fetching activity for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Server Error fetching activity.' });
    }
});

module.exports = router;
