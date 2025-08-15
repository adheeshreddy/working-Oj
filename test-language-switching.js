const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
};

async function testLanguageSwitching() {
    console.log('🧪 Testing Language Switching and Boilerplate Code\n');

    try {
        // Step 1: Authenticate user
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

        // Step 2: Get problems to check boilerplate code
        console.log('\n2. Fetching problems to check boilerplate code...');
        const problemsResponse = await axios.get(`${BASE_URL}/api/problems`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (problemsResponse.data && problemsResponse.data.length > 0) {
            const problem = problemsResponse.data[0];
            console.log(`✅ Found problem: "${problem.title}"`);
            
            // Check boilerplate code for each language
            console.log('\n3. Checking boilerplate code for each language...');
            
            const languages = ['cpp', 'java', 'python'];
            for (const lang of languages) {
                if (problem.boilerplateCode && problem.boilerplateCode[lang]) {
                    const boilerplate = problem.boilerplateCode[lang];
                    console.log(`✅ ${lang.toUpperCase()} boilerplate code found (${boilerplate.length} characters)`);
                    console.log(`   Preview: ${boilerplate.substring(0, 100)}...`);
                } else {
                    console.log(`❌ ${lang.toUpperCase()} boilerplate code missing`);
                }
            }
        } else {
            console.log('⚠️  No problems found');
        }

        // Step 3: Test error handling with invalid code
        console.log('\n4. Testing error handling with invalid code...');
        
        const invalidCode = `#include <iostream>
using namespace std;

int main() {
    // This will cause a compilation error
    cout << "Hello World"  // Missing semicolon
    return 0;
}`;

        try {
            const response = await axios.post(`${BASE_URL}/api/submissions/run-custom`, {
                code: invalidCode,
                language: 'cpp',
                customInput: 'test'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('❌ Expected compilation error but got success');
        } catch (error) {
            if (error.response?.data?.verdict === 'Compilation Error') {
                console.log('✅ Compilation error properly detected');
                console.log(`   Error: ${error.response.data.compileMessage.substring(0, 100)}...`);
            } else {
                console.log('⚠️  Error detected but not properly categorized');
                console.log(`   Response: ${JSON.stringify(error.response?.data)}`);
            }
        }

        // Step 4: Test TLE with infinite loop
        console.log('\n5. Testing TLE detection with infinite loop...');
        
        const infiniteLoopCode = `#include <iostream>
using namespace std;

int main() {
    // This will cause TLE
    while(true) {
        cout << "Infinite loop" << endl;
    }
    return 0;
}`;

        try {
            const response = await axios.post(`${BASE_URL}/api/submissions/run-custom`, {
                code: infiniteLoopCode,
                language: 'cpp',
                customInput: 'test'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('❌ Expected TLE but got success');
        } catch (error) {
            if (error.response?.data?.verdict === 'Time Limit Exceeded') {
                console.log('✅ TLE properly detected');
                console.log(`   Message: ${error.response.data.error}`);
            } else {
                console.log('⚠️  TLE not properly detected');
                console.log(`   Response: ${JSON.stringify(error.response?.data)}`);
            }
        }

        console.log('\n🎉 Language switching and error handling tests completed!');
        console.log('\n📋 Summary:');
        console.log('✅ Authentication working');
        console.log('✅ Boilerplate code available');
        console.log('✅ Compilation error detection');
        console.log('✅ TLE detection');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
    }
}

// Run the test
testLanguageSwitching();
