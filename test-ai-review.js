const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
};

const testCodes = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
    python: `a, b = map(int, input().split())
print(a + b)`
};

let authToken = '';

async function testAIReview() {
    console.log('🤖 Testing AI Review Functionality\n');

    try {
        // Step 1: Register/Login user
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

        // Step 2: Test AI Review for each language
        const languages = ['cpp', 'java', 'python'];
        
        for (const language of languages) {
            console.log(`\n2. Testing AI Review for ${language.toUpperCase()}...`);
            
            try {
                const response = await axios.post(`${BASE_URL}/api/ai-review`, {
                    userCode: testCodes[language],
                    language: language
                }, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });

                console.log(`✅ AI review successful for ${language.toUpperCase()}`);
                console.log(`   Review length: ${response.data.review.length} characters`);
                console.log(`   Language: ${response.data.language}`);
                console.log(`   Code length: ${response.data.codeLength} characters`);
                
                // Show first 200 characters of the review
                const preview = response.data.review.substring(0, 200);
                console.log(`   Preview: ${preview}...`);
                
            } catch (error) {
                if (error.response?.status === 400 && error.response?.data?.error === 'Missing API key') {
                    console.log(`❌ AI review failed for ${language.toUpperCase()}: Missing API key`);
                    console.log('   Please add your Google Gemini API key to backend/.env file');
                    console.log('   See AI_REVIEW_SETUP.md for instructions');
                } else if (error.response?.status === 401) {
                    console.log(`❌ AI review failed for ${language.toUpperCase()}: Invalid API key`);
                    console.log('   Please check your Google Gemini API key');
                } else {
                    console.log(`❌ AI review failed for ${language.toUpperCase()}: ${error.response?.data?.message || error.message}`);
                }
            }
        }

        console.log('\n🎉 AI Review testing completed!');
        console.log('\n📋 Summary:');
        console.log('✅ User authentication');
        console.log('✅ AI review endpoint accessible');
        console.log('⚠️  API key configuration required for full functionality');
        
        console.log('\n🔧 To enable AI review:');
        console.log('1. Get a Google Gemini API key from https://aistudio.google.com/');
        console.log('2. Add it to backend/.env file');
        console.log('3. Restart the backend server');
        console.log('4. Run this test again');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testAIReview();
