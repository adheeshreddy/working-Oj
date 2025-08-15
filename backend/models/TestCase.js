// backend/models/TestCase.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
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
    isHidden: {
        type: Boolean,
        default: true,
    },
    points: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('TestCase', testCaseSchema, 'testcases');
