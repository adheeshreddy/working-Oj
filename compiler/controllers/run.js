const { exec } = require("child_process");
const fs = require("fs/promises");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const { generateInputFile } = require("./generateInputFile");

const run = async (req, res) => {
    const { language = "cpp", code, input } = req.body;

    console.log("Run Request Received:");
    console.log("Language:", language);
    console.log("Input length:", input ? input.length : 0);

    if (!code) {
        console.error("Run Error: No code provided.");
        return res.status(400).json({ message: "Please provide valid code" });
    }

    let filePath;
    let inputFilePath;

    try {
        filePath = await generateFile(language, code);
        inputFilePath = await generateInputFile(input);

        console.log("Generated Files (Host Paths) for Run:");
        console.log("Code File:", filePath);
        console.log("Input File:", inputFilePath);

        let executionResult;
        
        if (language === "cpp") {
            executionResult = await executeCpp(filePath, inputFilePath); 
        } else if (language === "python") {
            // FIX: Pass a `null` or `undefined` for outputFilePath for run requests
            executionResult = await executePy(filePath, inputFilePath, null); 
        } else if (language === "java") {
            executionResult = await executeJava(filePath, inputFilePath);
        } else {
            console.error("Run Error: Unsupported language provided.");
            return res.status(400).json({ message: "Unsupported language" });
        }
        
        console.log("Run Execution Output:", executionResult);

        let outputMessage = executionResult.stdout || '';
        let compileMessage = executionResult.stderr || '';

        if (executionResult.verdict === 'Compilation Error' || executionResult.verdict === 'Runtime Error' || executionResult.verdict === 'Time Limit Exceeded' || executionResult.verdict === 'Internal Error') {
            res.json({
                success: false,
                output: '',
                compileMessage: compileMessage,
                verdict: executionResult.verdict,
            });
        } else {
            res.json({
                success: true,
                output: outputMessage.trim(),
                compileMessage: '',
                verdict: 'Passed',
            });
        }

    } catch (error) {
        console.error("Run Catch Block Error:", error);
        let cleanError = error.stderr || error.message || "Unknown error";
        let verdict = 'Internal Error';
        
        // Determine the type of error
        if (error.killed && error.signal === 'SIGTERM') {
            verdict = 'Time Limit Exceeded';
            cleanError = 'Time limit exceeded. Your code took too long to execute.';
        } else if (cleanError.includes('error:') || cleanError.includes('compilation')) {
            verdict = 'Compilation Error';
        } else if (cleanError.includes('runtime') || cleanError.includes('segmentation')) {
            verdict = 'Runtime Error';
        }
        
        if (filePath) {
            cleanError = cleanError.replace(new RegExp(filePath.replace(/\\/g, '\\\\'), 'g'), 'YourCode.' + language);
        }
        if (inputFilePath) {
            cleanError = cleanError.replace(new RegExp(inputFilePath.replace(/\\/g, '\\\\'), 'g'), 'YourInput.txt');
        }

        res.status(500).json({
            success: false,
            message: "Compilation or Execution Error",
            error: cleanError,
            compileMessage: cleanError,
            verdict: verdict,
        });
    } finally {
        if (filePath) {
            fs.unlink(filePath).catch(err => console.error('Error deleting code file:', err));
        }
        if (inputFilePath) {
            fs.unlink(inputFilePath).catch(err => console.error('Error deleting input file:', err));
        }
    }
};

module.exports = { run };