# 🤖 AI Review Setup Guide

This guide will help you set up and test the AI review functionality using Google Gemini API.

## 🔑 Getting Google Gemini API Key

### Step 1: Create Google AI Studio Account
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Accept the terms of service

### Step 2: Get API Key
1. In Google AI Studio, click on "Get API key" in the top right
2. Click "Create API key"
3. Copy the generated API key (it starts with `AIza...`)

### Step 3: Configure API Key
1. Open your `backend/.env` file
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```env
   GOOGLE_GEMINI_API_KEY=AIzaSyYourActualAPIKeyHere
   ```
3. Save the file

## 🧪 Testing AI Review

### Method 1: Using the Frontend
1. Start all services:
   ```bash
   # Terminal 1: MongoDB
   mongod
   
   # Terminal 2: Backend
   cd backend && npm run dev
   
   # Terminal 3: Compiler
   cd compiler && npm start
   
   # Terminal 4: Frontend
   cd frontend && npm run dev
   ```

2. Open http://localhost:5173 in your browser
3. Login with admin credentials: `admin@codevm.com` / `admin123`
4. Open any problem
5. Write some code in the editor
6. Click "Get AI Review" button
7. Check the "AI Review" tab for the review

### Method 2: Using Test Script
```bash
# Run the functionality test
node test-functionality.js
```

This will test the AI review along with other features.

### Method 3: Direct API Test
```bash
# Test the AI review endpoint directly
curl -X POST http://localhost:5000/api/ai-review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "userCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World!\" << endl;\n    return 0;\n}",
    "language": "cpp"
  }'
```

## 📋 What AI Review Covers

The AI review provides comprehensive feedback on:

1. **Code Quality**
   - Readability and clarity
   - Code structure and organization
   - Naming conventions

2. **Best Practices**
   - Language-specific best practices
   - Common patterns and anti-patterns
   - Code style improvements

3. **Performance & Efficiency**
   - Time complexity analysis
   - Memory usage considerations
   - Optimization suggestions

4. **Potential Issues**
   - Bugs or logical errors
   - Edge cases that might fail
   - Security considerations

5. **Suggestions for Improvement**
   - Specific code improvements
   - Alternative approaches
   - Refactoring suggestions

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing API key" error**
   - Make sure you've added your API key to `backend/.env`
   - Restart the backend server after adding the key

2. **"Authentication failed" error**
   - Check if your API key is correct
   - Make sure you copied the entire key

3. **"Rate limit exceeded" error**
   - Wait a few minutes and try again
   - Google has rate limits on free API usage

4. **"Request timeout" error**
   - The AI service might be slow
   - Try again in a few seconds

5. **"Invalid request" error**
   - Check if your code is valid
   - Make sure the language parameter is correct

### Debug Steps:
1. Check backend console for error messages
2. Verify API key is correctly set in `.env`
3. Test with a simple code snippet first
4. Check network tab in browser for API calls

## 💡 Tips for Better AI Reviews

1. **Write clear, readable code** - The AI can provide better feedback on well-structured code
2. **Include comments** - Comments help the AI understand your intent
3. **Use meaningful variable names** - This helps the AI suggest better naming conventions
4. **Test with different languages** - Try C++, Java, and Python to see language-specific feedback

## 🔒 Security Notes

- Keep your API key secure and don't commit it to version control
- The API key is stored in your local `.env` file only
- Consider using environment variables in production

## 📊 API Usage

- Google Gemini API has usage limits
- Free tier includes generous quotas
- Monitor your usage in Google AI Studio dashboard

## 🎯 Example AI Review Output

When working correctly, you should see output like:

```
## Code Quality
Your code is well-structured and follows good practices...

## Best Practices
✅ Good use of standard library
⚠️ Consider using more descriptive variable names
✅ Proper indentation and formatting

## Performance & Efficiency
The time complexity is O(n) which is optimal for this problem...

## Potential Issues
- Watch out for integer overflow with large inputs
- Consider edge cases like empty input

## Suggestions for Improvement
1. Add input validation
2. Consider using `const` for immutable variables
3. Add comments explaining the algorithm
```

## 🚀 Next Steps

Once AI review is working:
1. Test with different code examples
2. Try different programming languages
3. Experiment with complex algorithms
4. Use the feedback to improve your coding skills
