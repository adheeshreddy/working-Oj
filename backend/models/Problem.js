// backend/models/Problem.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    statement: {
        type: String,
        required: true,
    },
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    constraints: {
        type: String,
        required: true,
    },
    timeLimit: {
        type: Number,
        required: true,
        min: 1,
    },
    memoryLimit: {
        type: Number,
        required: true,
        min: 1,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    // Boilerplate code for different languages
    boilerplateCode: {
        cpp: {
            type: String,
            default: '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}'
        },
        java: {
            type: String,
            default: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n        \n    }\n}'
        },
        python: {
            type: String,
            default: '# Your code here\n\ndef main():\n    # Read input\n    pass\n\nif __name__ == "__main__":\n    main()'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Problem', problemSchema, 'problems');
