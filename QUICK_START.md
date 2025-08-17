# 🚀 Quick Start Guide - AlgoNest Online Judge

Follow these exact steps to set up and test your online judge system.

## 📋 Prerequisites Check

First, make sure you have these installed:
```bash
# Check Node.js version (should be 16 or higher)
node --version

# Check if MongoDB is installed
mongod --version

# Check if Git is installed
git --version
```

## 🛠️ Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install compiler dependencies
cd compiler
npm install
cd ..
```

## ⚙️ Step 2: Create Environment Files

### Create backend/.env file:
```bash
# Navigate to backend directory
cd backend

# Create .env file (Windows)
echo MONGO_URI=mongodb://localhost:27017/online_judge > .env
echo JWT_SECRET=your_super_secret_jwt_key_here >> .env
echo PORT=5000 >> .env
echo COMPILER_URL=http://localhost:9000 >> .env
echo GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here >> .env

# OR for Linux/Mac:
cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/online_judge
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
COMPILER_URL=http://localhost:9000
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
EOF

cd ..
```

### Create frontend/.env file:
```bash
# Navigate to frontend directory
cd frontend

# Create .env file (Windows)
echo VITE_SERVER=http://localhost:5000 > .env
echo VITE_COMPILER=http://localhost:9000 >> .env

# OR for Linux/Mac:
cat > .env << EOF
VITE_SERVER=http://localhost:5000
VITE_COMPILER=http://localhost:9000
EOF

cd ..
```

## 🗄️ Step 3: Start MongoDB

Open a new terminal window and run:
```bash
# Start MongoDB
mongod
```

Keep this terminal open - MongoDB needs to keep running.

## 🔧 Step 4: Setup Sample Data

Open another terminal window, navigate to your project root, and run:

```bash
# Run the setup script to create admin user and sample problems
node setup-sample-data.js
```

You should see output like:
```
✅ Connected to MongoDB

👤 Creating admin user...
✅ Admin user created successfully
   Email: admin@AlgoNest.com
   Password: admin123

📝 Creating sample problems...
✅ Problem "Sum of Two Numbers" created successfully
   ✅ 3 test cases created
✅ Problem "Find Maximum" created successfully
   ✅ 3 test cases created

🎉 Sample data setup completed!
```

## 🚀 Step 5: Start All Services

You'll need to start 3 services. Open 3 separate terminal windows:

### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```
You should see: `Server running on Port 5000`

### Terminal 2 - Compiler Service:
```bash
cd compiler
npm start
```
You should see: `Server is live on port 9000`

### Terminal 3 - Frontend (Optional for now):
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173/`

## 🧪 Step 6: Run Functionality Tests

Open another terminal window and run:

```bash
# Navigate to project root
cd /path/to/your/project

# Run the comprehensive test
node test-functionality.js
```

## 📊 Expected Test Results

You should see output like this:

```
🧪 Testing AlgoNest Online Judge Functionality

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
⚠️  AI review failed (likely missing API key)
   Error: Failed to get AI review from backend.

8. Testing Problem Retrieval with Boilerplate...
✅ Problem retrieval successful
   Has C++ boilerplate: true
   Has Java boilerplate: true
   Has Python boilerplate: true

🎉 All functionality tests passed!
```

## 🔑 Login Credentials

After setup, you can use these credentials:

**Admin User:**
- Email: `admin@AlgoNest.com`
- Password: `admin123`

**Test User (created by test script):**
- Email: `test@example.com`
- Password: `test123`

## 🌐 Access the Application

Once all services are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Compiler Service**: http://localhost:9000

## 🐛 Troubleshooting

### If MongoDB won't start:
```bash
# On Windows, try:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# On Mac/Linux, try:
sudo systemctl start mongod
```

### If ports are already in use:
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Check what's using port 9000
netstat -ano | findstr :9000

# Kill the process if needed
taskkill /PID <process_id> /F
```

### If dependencies fail to install:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### If test fails with "connection refused":
1. Make sure MongoDB is running
2. Make sure backend server is running on port 5000
3. Make sure compiler service is running on port 9000
4. Check your .env files are in the correct locations

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Compiler service is running on port 9000
- [ ] Sample data setup completed successfully
- [ ] All functionality tests passed
- [ ] Frontend is accessible (optional)

## 🎯 Next Steps

After successful testing:
1. Test the frontend interface
2. Create more problems and test cases
3. Configure AI review with a valid Gemini API key
4. Deploy to production

## 📞 Need Help?

If you encounter any issues:
1. Check the console output for error messages
2. Verify all services are running
3. Check your .env files are correct
4. Ensure MongoDB is running and accessible
