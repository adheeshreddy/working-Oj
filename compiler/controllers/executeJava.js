const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const util = require("util");
const { exec } = require('child_process');

const execPromise = util.promisify(exec);

const codesDir = path.join(__dirname, '..', 'codes');
const outputsDir = path.join(__dirname, '..', 'outputs');
const inputsDir = path.join(__dirname, '..', 'inputs');

if (!fs.existsSync(codesDir)) {
    fs.mkdirSync(codesDir, { recursive: true });
}
if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
}
if (!fs.existsSync(inputsDir)) {
    fs.mkdirSync(inputsDir, { recursive: true });
}

// FIX: executeJava for 'run' doesn't need outputFilePath
const executeJava = async (filePath, inputFilePath) => {
    const className = "Main";
    const renamedJavaSourceFilePath = path.join(codesDir, `${className}.java`);

    const start = process.hrtime.bigint();
    let stdout = '';
    let stderr = '';
    let error = null;
    
    try {
        await fsp.rename(filePath, renamedJavaSourceFilePath);

        const compileCommand = `javac "${renamedJavaSourceFilePath}" -d "${outputsDir}"`;
        const { stderr: compileStderr } = await execPromise(compileCommand, { timeout: 3000 });

        if (compileStderr) {
            throw { verdict: 'Compilation Error', message: compileStderr, stderr: compileStderr };
        }

        const runCommand = `java -cp "${outputsDir}" "${className}" < "${inputFilePath}"`;
        const { stdout: execStdout, stderr: runtimeStderr } = await execPromise(runCommand, { timeout: 2000 });

        stdout = execStdout;
        stderr = runtimeStderr;

        if (runtimeStderr) {
             throw { verdict: 'Runtime Error', message: runtimeStderr, stderr: runtimeStderr };
        }
        
        // No output comparison for 'run' requests
        const verdict = 'Passed'; 
        
        const end = process.hrtime.bigint();
        const executionTimeMs = Number(end - start) / 1e6;

        return {
            verdict: verdict,
            executionTimeMs: executionTimeMs,
            memoryUsed: 0,
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
        } else if (execError.verdict === 'Compilation Error') {
            verdict = 'Compilation Error';
            message = execError.message;
        } else if (execError.verdict === 'Runtime Error') {
            verdict = 'Runtime Error';
            message = execError.message;
        } else {
            message = execError.stderr || execError.message || "Unknown Error";
        }
        
        return {
            verdict: verdict,
            executionTimeMs: executionTimeMs,
            memoryUsed: 0,
            stdout: '',
            stderr: message,
        };

    }
};

module.exports = { executeJava };