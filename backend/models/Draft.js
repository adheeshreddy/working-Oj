// backend/models/Draft.js
const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },
    code: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        default: 'cpp',
    },
    lastSaved: {
        type: Date,
        default: Date.now,
    },
});

draftSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('Draft', draftSchema);
