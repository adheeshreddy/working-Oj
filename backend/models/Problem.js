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
            default: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <cmath>
#include <climits>

using namespace std;

int main() {
    // Read input
    int n;
    cin >> n;
    
    // Your solution here
    
    return 0;
}`
        },
        java: {
            type: String,
            default: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        int n = sc.nextInt();
        
        // Your solution here
        
        sc.close();
    }
}`
        },
        python: {
            type: String,
            default: `# Read input
n = int(input())

# Your solution here

# Print output
print(result)`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Problem', problemSchema, 'problems');
