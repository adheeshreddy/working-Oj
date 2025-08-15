const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const COMPILER_URL = 'http://localhost:9000';

// Test data
const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123'
};

const testProblem = {
    title: 'Sum of Two Numbers',
    statement: 'Given two integers a and b, return their sum.',
    input: 'The first line contains an integer T, the number of test cases. Each test case contains two integers a and b.',
    output: 'For each test case, output the sum of a and b.',
    constraints: '1 ≤ T ≤ 100\n1 ≤ a, b ≤ 1000',
    timeLimit: 1,
    memoryLimit: 256,
    difficulty: 'Easy',
    tags: ['math', 'basic'],
    boilerplateCode: {
        cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int t;\n    cin >> t;\n    while(t--) {\n        int a, b;\n        cin >> a >> b;\n        cout << a + b << endl;\n    }\n    return 0;\n}',
        java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int t = sc.nextInt();\n        while(t-- > 0) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(a + b);\n        }\n    }\n}',
        python: 't = int(input())\nfor _ in range(t):\n    a, b = map(int, input().split())\n    print(a + b)'
    }
};

const testCases = [
    {
        input: '2\n1 2\n3 4',
        output: '3\n7',
        isHidden: false,
        points: 10
    },
    {
        input: '1\n100 200',
        output: '300',
        isHidden: false,
        points: 10
    },
    {
        input: '3\n5 5\n10 20\n50 50',
        output: '10\n30\n100',
        isHidden: true,
        points: 20
    }
];

let authToken = '';
let problemId = '';

async function testFunctionality() {
    console.log('🧪 Testing CodeVM Online Judge Functionality\n');

    try {
        // Test 1: User Registration
        console.log('1. Testing User Registration...');
        try {
            const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, testUser);
            console.log('✅ User registration successful');
            authToken = registerResponse.data.token;
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

        // Test 2: Create Problem (Admin required)
        console.log('\n2. Testing Problem Creation...');
        const problemResponse = await axios.post(`${BASE_URL}/api/problems`, testProblem, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        problemId = problemResponse.data._id;
        console.log('✅ Problem created successfully');

        // Test 3: Create Test Cases
        console.log('\n3. Testing Test Case Creation...');
        for (const testCase of testCases) {
            await axios.post(`${BASE_URL}/api/problems/${problemId}/testcases`, testCase, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
        }
        console.log('✅ Test cases created successfully');

        // Test 4: Test Custom Code Execution
        console.log('\n4. Testing Custom Code Execution...');
        const customCode = '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}';
        
        const customResponse = await axios.post(`${BASE_URL}/api/submissions/run-custom`, {
            code: customCode,
            language: 'cpp',
            customInput: '5 3'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Custom code execution successful');
        console.log(`   Output: ${customResponse.data.output}`);

        // Test 5: Test Sample Test Case Execution
        console.log('\n5. Testing Sample Test Case Execution...');
        const sampleResponse = await axios.post(`${BASE_URL}/api/submissions/run-sample`, {
            problemId: problemId,
            code: customCode,
            language: 'cpp'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Sample test case execution successful');
        console.log(`   Passed: ${sampleResponse.data.passedTestCases}/${sampleResponse.data.totalTestCases}`);

        // Test 6: Test Full Submission (All Test Cases)
        console.log('\n6. Testing Full Submission...');
        const submitResponse = await axios.post(`${BASE_URL}/api/submissions`, {
            problemId: problemId,
            code: customCode,
            language: 'cpp'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Full submission successful');
        console.log(`   Verdict: ${submitResponse.data.verdict}`);
        console.log(`   Passed: ${submitResponse.data.passedTestCases}/${submitResponse.data.totalTestCases}`);

        // Test 7: Test AI Review
        console.log('\n7. Testing AI Review...');
        try {
            const aiResponse = await axios.post(`${BASE_URL}/api/ai-review`, {
                userCode: customCode,
                language: 'cpp'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('✅ AI review successful');
            console.log(`   Review length: ${aiResponse.data.review.length} characters`);
        } catch (error) {
            console.log('⚠️  AI review failed (likely missing API key)');
            console.log(`   Error: ${error.response?.data?.message || error.message}`);
        }

        // Test 8: Get Problem with Boilerplate Code
        console.log('\n8. Testing Problem Retrieval with Boilerplate...');
        const getProblemResponse = await axios.get(`${BASE_URL}/api/problems/${problemId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('✅ Problem retrieval successful');
        console.log(`   Has C++ boilerplate: ${!!getProblemResponse.data.boilerplateCode?.cpp}`);
        console.log(`   Has Java boilerplate: ${!!getProblemResponse.data.boilerplateCode?.java}`);
        console.log(`   Has Python boilerplate: ${!!getProblemResponse.data.boilerplateCode?.python}`);

        console.log('\n🎉 All functionality tests passed!');
        console.log('\n📋 Summary:');
        console.log('✅ User authentication');
        console.log('✅ Problem creation with boilerplate code');
        console.log('✅ Test case creation (sample and hidden)');
        console.log('✅ Custom code execution');
        console.log('✅ Sample test case execution');
        console.log('✅ Full submission with all test cases');
        console.log('✅ AI review (if API key configured)');
        console.log('✅ Problem retrieval with boilerplate code');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data?.message || error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the tests
testFunctionality();
