const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');
const userRoutes = require('./routes/userRoutes');
const testCaseRoutes = require('./routes/testCaseRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const draftRoutes = require('./routes/draftRoutes');
const axios = require('axios');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', testCaseRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/drafts', draftRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// AI Review Endpoint
app.post('/api/ai-review', async (req, res) => {
    // Only destructure userCode and language, as per the client-side update
    const { userCode, language } = req.body;

    if (!userCode || !language) {
        return res.status(400).json({ message: 'Code and language are required for AI review.' });
    }

    const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;

    // The AI prompt is now generic, as it doesn't have problem-specific details
    const userPrompt = `
        Please review the following code for general quality, readability, common patterns, and potential efficiency improvements.

        User's Code (${language}):
        \`\`\`${language}
        ${userCode}
        \`\`\`
    `;

    const payload = {
        contents: [{ role: "user", parts: [{ text: userPrompt }] }]
    };

    try {
        const geminiResponse = await axios.post(GEMINI_API_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0 &&
            geminiResponse.data.candidates[0].content && geminiResponse.data.candidates[0].content.parts &&
            geminiResponse.data.candidates[0].content.parts.length > 0) {
            const aiReviewText = geminiResponse.data.candidates[0].content.parts[0].text;
            res.json({ review: aiReviewText });
        } else {
            res.status(500).json({ message: 'AI review could not be generated from Gemini API.' });
        }
    } catch (error) {
        console.error('Error calling Gemini API from backend:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Failed to get AI review from backend.',
            error: error.response?.data?.error?.message || error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
