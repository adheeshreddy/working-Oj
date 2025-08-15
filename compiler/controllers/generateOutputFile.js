const fs = require("fs"); // Use regular fs for synchronous methods
const fsp = require("fs/promises"); // Use fsp for fs.promises
const path = require("path");
const { v4: uuid } = require("uuid");

const outputDir = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const generateOutputFile = (content) => {
    // This function uses writeFileSync, which is synchronous, so fsp is not needed here directly
    const jobId = uuid();
    const filename = `${jobId}.txt`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, content); // Use regular fs for writeFileSync
    return filepath;
};

module.exports = { generateOutputFile };
