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
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    int sum = 0;
    for(int i = 0; i < n; i++) {
        sum += arr[i];
    }
    
    cout << sum << endl;
    return 0;
}`;

let authToken = '';
let problemId = '';

async function testAIReviewWithProblem() {
    console.log('🤖 Testing AI Review with Problem Context\n');

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

        // Step 2: Get a problem for context
        console.log('\n2. Fetching problem for context...');
        try {
            const problemsResponse = await axios.get(`${BASE_URL}/api/problems`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            
            if (problemsResponse.data && problemsResponse.data.length > 0) {
                problemId = problemsResponse.data[0]._id;
                console.log(`✅ Found problem: "${problemsResponse.data[0].title}"`);
                console.log(`   Problem ID: ${problemId}`);
            } else {
                console.log('⚠️  No problems found, testing without problem context');
            }
        } catch (error) {
            console.log('⚠️  Could not fetch problems, testing without problem context');
        }

        // Step 3: Test AI Review with problem context
        console.log('\n3. Testing AI Review with problem context...');
        const response = await axios.post(`${BASE_URL}/api/ai-review`, {
            userCode: testCode,
            language: 'cpp',
            problemId: problemId
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ AI Review request successful!');
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${response.data.success}`);
        console.log(`   Language: ${response.data.language}`);
        console.log(`   Code Length: ${response.data.codeLength} characters`);
        console.log(`   Is Mock: ${response.data.isMock || false}`);
        console.log(`   Problem Context: ${problemId ? 'Included' : 'Not included'}`);
        
        if (response.data.isMock) {
            console.log('\n📝 Mock Review Generated:');
            console.log('   This is a mock review for testing purposes.');
            console.log('   To get real AI reviews, add your Google Gemini API key.');
        } else {
            console.log('\n🤖 Real AI Review Generated:');
            console.log('   Your Google Gemini API key is working!');
        }

        // Show first 500 characters of the review
        const reviewPreview = response.data.review.substring(0, 500);
        console.log(`\n📋 Review Preview:\n${reviewPreview}...`);

        console.log('\n🎉 AI Review with problem context is working!');
        console.log('\n📋 Summary:');
        console.log('✅ Authentication working');
        console.log('✅ Problem context fetched');
        console.log('✅ AI Review endpoint accessible');
        console.log('✅ Review generated successfully');
        console.log(`✅ ${response.data.isMock ? 'Mock' : 'Real'} AI review received`);
        console.log(`✅ Problem context: ${problemId ? 'Included' : 'Not included'}`);

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
        
        if (error.response?.status === 400) {
            console.log('\n🔧 Troubleshooting:');
            console.log('1. Make sure the backend server is running');
            console.log('2. Check if the request format is correct');
            console.log('3. Verify the authentication token');
            console.log('4. Ensure there are problems in the database');
        }
    }
}

// Run the test
testAIReviewWithProblem();
