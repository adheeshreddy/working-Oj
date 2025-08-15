const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const util = require("util");
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

const codesDir = path.join(__dirname, '..', 'codes');
const inputsDir = path.join(__dirname, '..', 'inputs');
const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true });
}
if (!fs.existsSync(inputsDir)) {
    fs.mkdirSync(inputsDir, { recursive: true });
}
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// FIX: Added outputFilePath parameter to perform the comparison
const executePy = async (filePath, inputFilePath, outputFilePath) => {
    // FIX: Set a timeout for execution in milliseconds (e.g., 2000ms = 2s)
    const command = `python "${filePath}" < "${inputFilePath}"`;

    const start = process.hrtime.bigint();
    let stdout = '';
    let stderr = '';
    let error = null;

    try {
        const { stdout: execStdout, stderr: execStderr } = await execPromise(command, { timeout: 2000 });
        stdout = execStdout;
        stderr = execStderr;
    } catch (execError) {
        if (execError.killed && execError.signal === 'SIGTERM') {
            error = { message: "Time Limit Exceeded", stderr: execError.stderr };
        } else {
            error = { message: execError.message, stderr: execError.stderr };
        }
    }
    const end = process.hrtime.bigint();
    const executionTimeMs = Number(end - start) / 1e6;

    let verdict = "Passed";
    let message = '';
    let memoryUsed = 0; // This would require more advanced Docker/container metrics

    if (error) {
        if (error.message.includes("Time Limit Exceeded")) {
            verdict = "Time Limit Exceeded";
            message = "Time Limit Exceeded";
        } else if (error.message.includes("SyntaxError")) {
             verdict = "Compilation Error";
             message = error.stderr;
        } else {
            verdict = "Runtime Error";
            message = error.stderr;
        }
    } else {
        try {
            // FIX: Only read and compare the output if outputFilePath is provided
            if (outputFilePath) {
                const expectedOutputContent = await fsp.readFile(outputFilePath, 'utf-8');
                
                if (stdout.trim() !== expectedOutputContent.trim()) {
                    verdict = "Wrong Answer";
                    message = "Output does not match expected output.";
                }
            }
        } catch (fileError) {
            verdict = "Internal Error";
            message = "Error reading expected output file.";
        }
    }
    
    // FIX: Return a structured object with all necessary information
    return {
        verdict,
        executionTimeMs,
        memoryUsed,
        stdout,
        stderr: stderr || message,
    };
};

module.exports = { executePy };