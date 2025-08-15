const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');
const userRoutes = require('./routes/userRoutes');
const testCaseRoutes = require('./routes/testCaseRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const draftRoutes = require('./routes/draftRoutes');
const { protect } = require('./middleware/authMiddleware');
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

// AI Review Endpoint - Now protected with authentication
app.post('/api/ai-review', protect, async (req, res) => {
    const { userCode, language, problemId } = req.body;

    if (!userCode || !language) {
        return res.status(400).json({ message: 'Code and language are required for AI review.' });
    }

    // Fetch problem context if problemId is provided
    let problemContext = null;
    if (problemId) {
        try {
            const Problem = require('./models/Problem');
            problemContext = await Problem.findById(problemId);
            if (!problemContext) {
                console.log(`Problem with ID ${problemId} not found, proceeding without context`);
            }
        } catch (error) {
            console.log('Error fetching problem context:', error.message);
        }
    }

    const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
    
    // Check if API key is configured
    if (!GOOGLE_GEMINI_API_KEY || GOOGLE_GEMINI_API_KEY === 'your_gemini_api_key_here') {
        // Return a mock AI review for testing purposes
        const mockReview = generateMockAIReview(userCode, language, problemContext);
        return res.status(200).json({ 
            review: mockReview,
            success: true,
            language: language,
            codeLength: userCode.length,
            isMock: true,
            message: 'Mock AI review generated. Add your Google Gemini API key to get real AI reviews.'
        });
    }

    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;

    // Enhanced prompt for better code review with problem context
    let userPrompt = `You are an expert competitive programming code reviewer and algorithm analyst. Please provide a comprehensive review of the following ${language} code.`;

    // Add problem context if available
    if (problemContext) {
        userPrompt += `

## PROBLEM CONTEXT
**Title**: ${problemContext.title}
**Description**: ${problemContext.description}
**Constraints**: ${problemContext.constraints || 'Not specified'}
**Difficulty**: ${problemContext.difficulty || 'Not specified'}

## YOUR TASK
Analyze the code in the context of this specific problem and provide a comprehensive review covering:`;
    } else {
        userPrompt += `

## YOUR TASK
Analyze the following code and provide a comprehensive review covering:`;
    }

    userPrompt += `

1. **SOLUTION CORRECTNESS** (Most Important):
   - Does the code correctly solve the given problem?
   - Are all edge cases handled properly?
   - Does it meet the problem constraints?
   - Will it pass all test cases?

2. **ALGORITHM ANALYSIS**:
   - **Time Complexity**: O(?) - Explain your analysis
   - **Space Complexity**: O(?) - Explain your analysis
   - Is this the optimal approach for this problem?
   - Are there more efficient algorithms?

3. **CODE QUALITY**:
   - Readability and clarity
   - Code structure and organization
   - Variable naming and conventions
   - Error handling

4. **BEST PRACTICES**:
   - Language-specific best practices
   - Competitive programming patterns
   - Code style improvements
   - Input/output handling

5. **OPTIMIZATION OPPORTUNITIES**:
   - Performance improvements
   - Memory usage optimization
   - Code simplification
   - Alternative approaches

6. **POTENTIAL ISSUES**:
   - Bugs or logical errors
   - Edge cases that might fail
   - Overflow/underflow issues
   - Precision problems (for floating point)

7. **COMPETITIVE PROGRAMMING TIPS**:
   - Is this approach suitable for competitive programming?
   - Any tricks or optimizations specific to this problem type?
   - Common pitfalls to avoid

Please provide your review in a clear, structured format with specific examples and actionable suggestions. Be constructive and educational.

Code to review:
\`\`\`${language}
${userCode}
\`\`\`

${problemContext ? 'Remember: This code is intended to solve the specific problem described above.' : ''}
    `;

    const payload = {
        contents: [{ 
            role: "user", 
            parts: [{ text: userPrompt }] 
        }],
        generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };

    try {
        console.log('Sending request to Gemini API...');
        const geminiResponse = await axios.post(GEMINI_API_URL, payload, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        console.log('Gemini API response received');

        if (geminiResponse.data.candidates && 
            geminiResponse.data.candidates.length > 0 &&
            geminiResponse.data.candidates[0].content && 
            geminiResponse.data.candidates[0].content.parts &&
            geminiResponse.data.candidates[0].content.parts.length > 0) {
            
            const aiReviewText = geminiResponse.data.candidates[0].content.parts[0].text;
            
            // Log successful review generation
            console.log(`AI review generated successfully for ${language} code (${userCode.length} characters)`);
            
            res.json({ 
                review: aiReviewText,
                success: true,
                language: language,
                codeLength: userCode.length,
                isMock: false
            });
        } else {
            console.error('Unexpected response structure from Gemini API:', geminiResponse.data);
            res.status(500).json({ 
                message: 'AI review could not be generated. Unexpected response from Gemini API.',
                error: 'Invalid response structure'
            });
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        
        // Handle specific error cases
        if (error.response?.status === 400) {
            res.status(400).json({
                message: 'Invalid request to AI service. Please check your code and try again.',
                error: error.response?.data?.error?.message || 'Bad request'
            });
        } else if (error.response?.status === 401) {
            res.status(401).json({
                message: 'Invalid API key. Please check your Google Gemini API key configuration.',
                error: 'Authentication failed'
            });
        } else if (error.response?.status === 429) {
            res.status(429).json({
                message: 'Rate limit exceeded. Please try again in a few minutes.',
                error: 'Rate limit exceeded'
            });
        } else if (error.code === 'ECONNABORTED') {
            res.status(408).json({
                message: 'Request timeout. The AI service is taking too long to respond.',
                error: 'Request timeout'
            });
        } else {
            res.status(500).json({
                message: 'Failed to get AI review. Please try again later.',
                error: error.response?.data?.error?.message || error.message
            });
        }
    }
});

// Helper function to generate mock AI review for testing
function generateMockAIReview(userCode, language, problemContext = null) {
    const codeLength = userCode.length;
    const hasMainFunction = userCode.includes('main') || userCode.includes('def main') || userCode.includes('public static void main');
    const hasComments = userCode.includes('//') || userCode.includes('#') || userCode.includes('/*');
    const hasVariables = userCode.includes('int ') || userCode.includes('string ') || userCode.includes('var ') || userCode.includes('let ');
    const hasLoops = userCode.includes('for') || userCode.includes('while');
    const hasConditionals = userCode.includes('if') || userCode.includes('else');
    
    let review = `## 🤖 Mock AI Review (${language.toUpperCase()})

**Note**: This is a mock review for testing purposes. Add your Google Gemini API key to get real AI reviews.

${problemContext ? `
## 📋 Problem Context
**Title**: ${problemContext.title}
**Difficulty**: ${problemContext.difficulty || 'Not specified'}
**Description**: ${problemContext.description.substring(0, 200)}${problemContext.description.length > 200 ? '...' : ''}
` : ''}

## 🔍 Solution Analysis
Your code appears to be ${codeLength} characters long. ${hasMainFunction ? '✅ Good: Contains main function' : '⚠️ Consider: Add main function'}.

## 📊 Algorithm Assessment
${hasLoops ? '✅ Contains loops - Good for iterative solutions' : '⚠️ No loops detected - Consider if iteration is needed'}
${hasConditionals ? '✅ Contains conditionals - Good for decision making' : '⚠️ No conditionals detected - Consider if branching is needed'}

## 🎯 Code Quality
${hasComments ? '✅ Good: Code includes comments' : '⚠️ Consider: Add comments to explain your logic'}
${hasVariables ? '✅ Good: Uses variables' : '⚠️ Consider: Use variables for better readability'}

## ⚡ Performance & Efficiency
- **Code length**: ${codeLength} characters
- **Language**: ${language.toUpperCase()}
- **Structure**: ${hasMainFunction ? 'Well-structured' : 'Could be improved'}
- **Time Complexity**: O(?) - Mock analysis (real AI would provide detailed analysis)
- **Space Complexity**: O(?) - Mock analysis (real AI would provide detailed analysis)

## 🚨 Potential Issues
- This is a mock review - real AI would provide detailed algorithm analysis
- Consider adding input validation
- Check for edge cases
- Verify time/space complexity meets problem constraints

## 💡 Suggestions for Improvement
1. Add your Google Gemini API key to backend/.env file
2. Restart the backend server
3. Try the AI review again for real feedback with:
   - Detailed time/space complexity analysis
   - Problem-specific solution correctness
   - Competitive programming optimizations
   - Edge case handling

## 🚀 Next Steps
To get real AI reviews:
1. Go to https://aistudio.google.com/
2. Create an API key
3. Add it to backend/.env as GOOGLE_GEMINI_API_KEY=your_key_here
4. Restart the backend server

---
*Mock review generated for testing purposes*`;

    return review;
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
