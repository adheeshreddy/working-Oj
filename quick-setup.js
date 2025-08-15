const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Quick Setup for CodeVM Online Judge\n');

// Check if Node.js is installed
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
    console.error('❌ Node.js is not installed. Please install Node.js first.');
    process.exit(1);
}

// Check if npm is installed
try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
    console.error('❌ npm is not installed. Please install npm first.');
    process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

const directories = ['backend', 'frontend', 'compiler'];

for (const dir of directories) {
    console.log(`\nInstalling dependencies for ${dir}...`);
    try {
        execSync('npm install', { cwd: dir, stdio: 'inherit' });
        console.log(`✅ ${dir} dependencies installed`);
    } catch (error) {
        console.error(`❌ Failed to install dependencies for ${dir}`);
        process.exit(1);
    }
}

// Create environment files
console.log('\n⚙️ Creating environment files...');

// Backend .env
const backendEnvPath = path.join('backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
    const backendEnvContent = `MONGO_URI=mongodb://localhost:27017/online_judge
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
PORT=5000
COMPILER_URL=http://localhost:9000
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here`;
    
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Backend .env file created');
} else {
    console.log('⚠️ Backend .env file already exists');
}

// Frontend .env
const frontendEnvPath = path.join('frontend', '.env');
if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = `VITE_SERVER=http://localhost:5000
VITE_COMPILER=http://localhost:9000`;
    
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Frontend .env file created');
} else {
    console.log('⚠️ Frontend .env file already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start MongoDB: mongod');
console.log('2. Run sample data setup: node setup-sample-data.js');
console.log('3. Start backend: cd backend && npm run dev');
console.log('4. Start compiler: cd compiler && npm start');
console.log('5. Start frontend: cd frontend && npm run dev');
console.log('6. Run tests: node test-functionality.js');
console.log('\n🔑 Default admin credentials: admin@codevm.com / admin123');
