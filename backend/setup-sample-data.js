const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

// Import models
const User = require('./models/User');
const Problem = require('./models/Problem');
const TestCase = require('./models/TestCase');

// Sample data
const adminUser = {
    name: 'Admin User',
    email: 'admin@codevm.com',
    password: 'admin123',
    userType: 'admin'
};

const sampleProblems = [
    {
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
    },
    {
        title: 'Find Maximum',
        statement: 'Given an array of integers, find the maximum element.',
        input: 'The first line contains an integer n, the size of array. The second line contains n space-separated integers.',
        output: 'Output the maximum element in the array.',
        constraints: '1 ≤ n ≤ 1000\n1 ≤ arr[i] ≤ 10000',
        timeLimit: 1,
        memoryLimit: 256,
        difficulty: 'Easy',
        tags: ['array', 'basic'],
        boilerplateCode: {
            cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for(int i = 0; i < n; i++) {\n        cin >> arr[i];\n    }\n    // Your code here\n    \n    return 0;\n}',
            java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for(int i = 0; i < n; i++) {\n            arr[i] = sc.nextInt();\n        }\n        // Your code here\n        \n    }\n}',
            python: 'n = int(input())\narr = list(map(int, input().split()))\n# Your code here'
        }
    }
];

const sampleTestCases = {
    'Sum of Two Numbers': [
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
    ],
    'Find Maximum': [
        {
            input: '5\n1 2 3 4 5',
            output: '5',
            isHidden: false,
            points: 10
        },
        {
            input: '3\n10 5 8',
            output: '10',
            isHidden: false,
            points: 10
        },
        {
            input: '4\n100 200 150 300',
            output: '300',
            isHidden: true,
            points: 20
        }
    ]
};

async function setupSampleData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online_judge');
        console.log('✅ Connected to MongoDB');

        // Create admin user
        console.log('\n👤 Creating admin user...');
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
        } else {
            const admin = new User(adminUser);
            await admin.save();
            console.log('✅ Admin user created successfully');
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Password: ${adminUser.password}`);
        }

        // Create sample problems
        console.log('\n📝 Creating sample problems...');
        for (const problemData of sampleProblems) {
            const existingProblem = await Problem.findOne({ title: problemData.title });
            if (existingProblem) {
                console.log(`⚠️  Problem "${problemData.title}" already exists`);
                continue;
            }

            const problem = new Problem(problemData);
            const savedProblem = await problem.save();
            console.log(`✅ Problem "${problemData.title}" created successfully`);

            // Create test cases for this problem
            const testCases = sampleTestCases[problemData.title];
            if (testCases) {
                for (const testCaseData of testCases) {
                    const testCase = new TestCase({
                        ...testCaseData,
                        problemId: savedProblem._id
                    });
                    await testCase.save();
                }
                console.log(`   ✅ ${testCases.length} test cases created`);
            }
        }

        console.log('\n🎉 Sample data setup completed!');
        console.log('\n📋 Summary:');
        console.log('✅ Admin user created');
        console.log('✅ Sample problems created with boilerplate code');
        console.log('✅ Sample and hidden test cases created');
        console.log('\n🔑 Login Credentials:');
        console.log('   Email: admin@codevm.com');
        console.log('   Password: admin123');

    } catch (error) {
        console.error('❌ Error setting up sample data:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run the setup
setupSampleData();
