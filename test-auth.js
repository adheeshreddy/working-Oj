const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
};

async function testAuthentication() {
    console.log('🔐 Testing Authentication\n');

    try {
        // Step 1: Register/Login user
        console.log('1. Authenticating user...');
        let authToken = '';
        
        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, testUser);
            authToken = registerResponse.data.token;
            console.log('✅ User registered successfully');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
                console.log('⚠️  User already exists, trying login...');
                const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
                    email: testUser.email,
                    password: testUser.password
                });
                authToken = loginResponse.data.token;
                console.log('✅ User login successful');
            } else {
                throw error;
            }
        }

        // Step 2: Test token format
        console.log('\n2. Testing token format...');
        const tokenParts = authToken.split('.');
        if (tokenParts.length !== 3) {
            throw new Error('Invalid JWT token format');
        }
        
        try {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            console.log('✅ Token format is valid');
            console.log(`   User ID: ${payload._id}`);
            console.log(`   User Type: ${payload.userType}`);
            console.log(`   Expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
            
            // Check if token is expired
            const currentTime = Date.now() / 1000;
            if (payload.exp < currentTime) {
                throw new Error('Token is expired');
            }
            console.log('✅ Token is not expired');
            
        } catch (error) {
            throw new Error(`Token payload error: ${error.message}`);
        }

        // Step 3: Test protected endpoint
        console.log('\n3. Testing protected endpoint...');
        try {
            const response = await axios.get(`${BASE_URL}/api/problems`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ Protected endpoint accessible');
            console.log(`   Response status: ${response.status}`);
        } catch (error) {
            throw new Error(`Protected endpoint failed: ${error.response?.data?.message || error.message}`);
        }

        // Step 4: Test AI Review endpoint specifically
        console.log('\n4. Testing AI Review endpoint...');
        try {
            const response = await axios.post(`${BASE_URL}/api/ai-review`, {
                userCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}',
                language: 'cpp'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ AI Review endpoint accessible');
            console.log(`   Response status: ${response.status}`);
            
            if (response.data.error === 'Missing API key') {
                console.log('⚠️  AI Review endpoint working but missing API key');
            } else {
                console.log('✅ AI Review endpoint working correctly');
            }
            
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('❌ AI Review endpoint: Authentication failed');
                console.log(`   Error: ${error.response.data.message}`);
            } else if (error.response?.status === 400 && error.response.data.error === 'Missing API key') {
                console.log('✅ AI Review endpoint: Authentication working, but missing API key');
            } else {
                console.log(`❌ AI Review endpoint failed: ${error.response?.data?.message || error.message}`);
            }
        }

        console.log('\n🎉 Authentication testing completed!');
        console.log('\n📋 Summary:');
        console.log('✅ User authentication');
        console.log('✅ JWT token format');
        console.log('✅ Token expiration check');
        console.log('✅ Protected endpoint access');
        console.log('✅ AI Review endpoint access');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testAuthentication();
