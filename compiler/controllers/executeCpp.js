const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const util = require("util");
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

const outputPath = path.join(__dirname, "../outputs");
const codesDir = path.join(__dirname, 'codes');
const inputsDir = path.join(__dirname, 'inputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}
if (!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true });
}
if (!fs.existsSync(inputsDir)) {
    fs.mkdirSync(inputsDir, { recursive: true });
}

// FIX: Added outputFilePath parameter to handle the comparison logic for submissions
const executeCpp = async (filePath, inputFilePath, outputFilePath) => {
    const start = process.hrtime.bigint();
    const jobId = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    const compileCommand = `g++ "${filePath}" -o "${outPath}"`;
    const runCommand = `"${outPath}" < "${inputFilePath}"`;

    let stdout = '';
    let stderr = '';
    let error = null;

    try {
        await execPromise(compileCommand, { timeout: 3000 });
        const { stdout: execStdout, stderr: execStderr } = await execPromise(runCommand, { timeout: 2000 });
        stdout = execStdout;
        stderr = execStderr;

        if (stderr) {
            throw { verdict: 'Runtime Error', message: stderr, stderr: stderr };
        }

        // FIX: Added output comparison logic for submissions
        let verdict = 'Passed';
        if (outputFilePath) {
            const expectedOutputContent = await fsp.readFile(outputFilePath, 'utf-8');
            if (stdout.trim() !== expectedOutputContent.trim()) {
                verdict = 'Wrong Answer';
            }
        }
        
        const end = process.hrtime.bigint();
        const executionTimeMs = Number(end - start) / 1e6;
        const memoryUsed = 0; // Placeholder

        // FIX: Always return a structured object on success
        return {
            verdict: verdict,
            executionTimeMs: executionTimeMs,
            memoryUsed: memoryUsed,
            stdout: stdout,
            stderr: '',
        };

    } catch (execError) {
        const end = process.hrtime.bigint();
        const executionTimeMs = Number(end - start) / 1e6;
        let verdict = 'Internal Error';
        let message = '';
        
        if (execError.killed && execError.signal === 'SIGTERM') {
            verdict = 'Time Limit Exceeded';
            message = "Time limit exceeded.";
        } else if (execError.stderr && execError.stderr.includes('error:')) {
            verdict = 'Compilation Error';
            message = execError.stderr;
        } else if (execError.stderr) {
            verdict = 'Runtime Error';
            message = execError.stderr;
        } else {
            message = execError.message || "Unknown Error";
        }

        // FIX: Always return a structured object on failure
        return {
            verdict: verdict,
            executionTimeMs: executionTimeMs,
            memoryUsed: 0,
            stdout: '',
            stderr: message,
        };
    } finally {
        // Cleanup logic to remove the executable
        const exePath = path.join(outputPath, `${jobId}.out`);
        fsp.unlink(exePath).catch(err => console.error('Error deleting executable file:', err));
    }
};

module.exports = { executeCpp };