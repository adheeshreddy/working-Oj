const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
};

const testCode = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`;

let authToken = '';

async function testAIReviewWorking() {
    console.log('🤖 Testing AI Review Functionality\n');

    try {
        // Step 1: Authenticate user
        console.log('1. Authenticating user...');
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

        // Step 2: Test AI Review
        console.log('\n2. Testing AI Review...');
        const response = await axios.post(`${BASE_URL}/api/ai-review`, {
            userCode: testCode,
            language: 'cpp',
            problemId: null // No problem context for this test
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ AI Review request successful!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${response.data.success}`);
        console.log(`   Language: ${response.data.language}`);
        console.log(`   Code Length: ${response.data.codeLength} characters`);
        console.log(`   Is Mock: ${response.data.isMock || false}`);
        
        if (response.data.isMock) {
            console.log('\n📝 Mock Review Generated:');
            console.log('   This is a mock review for testing purposes.');
            console.log('   To get real AI reviews, add your Google Gemini API key.');
        } else {
            console.log('\n🤖 Real AI Review Generated:');
            console.log('   Your Google Gemini API key is working!');
        }

        // Show first 300 characters of the review
        const reviewPreview = response.data.review.substring(0, 300);
        console.log(`\n📋 Review Preview:\n${reviewPreview}...`);

        console.log('\n🎉 AI Review functionality is working!');
        console.log('\n📋 Summary:');
        console.log('✅ Authentication working');
        console.log('✅ AI Review endpoint accessible');
        console.log('✅ Review generated successfully');
        console.log(`✅ ${response.data.isMock ? 'Mock' : 'Real'} AI review received`);

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 400) {
            console.log('\n🔧 Troubleshooting:');
            console.log('1. Make sure the backend server is running');
            console.log('2. Check if the request format is correct');
            console.log('3. Verify the authentication token');
        }
    }
}

// Run the test
testAIReviewWorking();
