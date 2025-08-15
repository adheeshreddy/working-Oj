# CodeVM Online Judge - Functionality Testing Guide

This guide will help you test the core functionality of the CodeVM Online Judge system.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### 2. Setup Environment
```bash
# Clone the repository
git clone <your-repo-url>
cd ONLINE_JUDGE-main

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd compiler && npm install && cd ..
```

### 3. Environment Configuration
Create `.env` files in backend and frontend directories:

**backend/.env:**
```env
MONGO_URI=mongodb://localhost:27017/online_judge
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
COMPILER_URL=http://localhost:9000
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**frontend/.env:**
```env
VITE_SERVER=http://localhost:5000
VITE_COMPILER=http://localhost:9000
```

### 4. Start Services
```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Compiler Service
cd compiler
npm start

# Terminal 4: Start Frontend
cd frontend
npm run dev
```

## 🧪 Testing Core Functionality

### 1. Setup Sample Data
```bash
# Run the sample data setup script
node setup-sample-data.js
```

This will create:
- Admin user (admin@codevm.com / admin123)
- Sample problems with boilerplate code
- Sample and hidden test cases

### 2. Run Functionality Tests
```bash
# Run the comprehensive test script
node test-functionality.js
```

This will test:
- ✅ User authentication
- ✅ Problem creation with boilerplate code
- ✅ Test case creation (sample and hidden)
- ✅ Custom code execution
- ✅ Sample test case execution
- ✅ Full submission with all test cases
- ✅ AI review (if API key configured)
- ✅ Problem retrieval with boilerplate code

## 🔧 Core Features Implemented

### 1. Sample vs Hidden Test Cases
- **Sample Test Cases**: Visible to users, used for testing code
- **Hidden Test Cases**: Only visible to admins, used for final evaluation
- **Run vs Submit**: 
  - Run: Executes only sample test cases
  - Submit: Executes all test cases (including hidden)

### 2. Custom Test Case Execution
- Users can provide custom input
- Code executes with custom input
- Returns output for verification

### 3. Boilerplate Code
- Each problem has boilerplate code for C++, Java, and Python
- Automatically loaded when user selects a language
- Helps users get started quickly

### 4. AI Review Feature
- Integrates with Google Gemini API
- Provides code quality analysis
- Suggests improvements and best practices

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems` - Create problem (Admin only)
- `PUT /api/problems/:id` - Update problem (Admin only)
- `DELETE /api/problems/:id` - Delete problem (Admin only)

### Test Cases
- `GET /api/problems/:problemId/testcases` - Get all test cases (Admin only)
- `GET /api/problems/:problemId/testcases/sample` - Get sample test cases
- `POST /api/problems/:problemId/testcases` - Create test case (Admin only)

### Code Execution
- `POST /api/submissions/run-sample` - Run on sample test cases
- `POST /api/submissions/run-custom` - Run with custom input
- `POST /api/submissions` - Submit for full evaluation

### AI Review
- `POST /api/ai-review` - Get AI code review

## 🎯 Testing Scenarios

### Scenario 1: User Registration and Login
1. Register a new user
2. Login with credentials
3. Verify JWT token generation

### Scenario 2: Problem Creation (Admin)
1. Login as admin
2. Create a problem with boilerplate code
3. Add sample and hidden test cases
4. Verify problem retrieval

### Scenario 3: Code Execution
1. Login as regular user
2. Select a problem
3. Write code using boilerplate
4. Test with custom input
5. Run on sample test cases
6. Submit for full evaluation

### Scenario 4: AI Review
1. Write some code
2. Request AI review
3. Verify review response

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file

2. **Compiler Service Not Responding**
   - Check if compiler service is running on port 9000
   - Verify COMPILER_URL in environment variables

3. **AI Review Not Working**
   - Check if GOOGLE_GEMINI_API_KEY is set
   - Verify API key is valid

4. **Test Cases Not Working**
   - Ensure test cases are created with correct format
   - Check isHidden flag for sample vs hidden test cases

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## 📊 Expected Test Results

When running `test-functionality.js`, you should see:

```
🧪 Testing CodeVM Online Judge Functionality

1. Testing User Registration...
✅ User registration successful

2. Testing Problem Creation...
✅ Problem created successfully

3. Testing Test Case Creation...
✅ Test cases created successfully

4. Testing Custom Code Execution...
✅ Custom code execution successful
   Output: 8

5. Testing Sample Test Case Execution...
✅ Sample test case execution successful
   Passed: 2/2

6. Testing Full Submission...
✅ Full submission successful
   Verdict: Accepted
   Passed: 3/3

7. Testing AI Review...
✅ AI review successful
   Review length: 245 characters

8. Testing Problem Retrieval with Boilerplate...
✅ Problem retrieval successful
   Has C++ boilerplate: true
   Has Java boilerplate: true
   Has Python boilerplate: true

🎉 All functionality tests passed!
```

## 🎉 Success Criteria

The system is working correctly if:
- ✅ All API endpoints respond correctly
- ✅ Sample test cases execute properly
- ✅ Hidden test cases are included in submissions
- ✅ Custom input execution works
- ✅ Boilerplate code is loaded correctly
- ✅ AI review provides meaningful feedback
- ✅ User roles and permissions work correctly

## 🔮 Next Steps

After confirming functionality:
1. Test the frontend integration
2. Add more complex test cases
3. Implement additional features
4. Deploy to production environment
