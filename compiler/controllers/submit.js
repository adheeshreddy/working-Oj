const { exec } = require("child_process");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const { executeJava } = require("./executeJava");
const { generateInputFile } = require("./generateInputFile");
const { generateOutputFile } = require("./generateOutputFile");

const submit = async (req, res) => {
    const { language = "cpp", code, input, expectedOutput, id, QID } = req.body;

    console.log("Submit Request Received:");
    console.log("Language:", language);
    console.log("QID:", QID);
    console.log("Input length:", input ? input.length : 0);
    console.log("Expected Output length:", expectedOutput ? expectedOutput.length : 0);

    if (!code || !input || !expectedOutput || !id || !QID) {
        console.error("Submit Error: Missing required fields in request body.");
        return res.status(400).json({ message: "Missing required fields" });
    }

    let filePath;
    let inputFilePath;
    let outputFilePath;

    try {
        filePath = await generateFile(language, code);
        inputFilePath = await generateInputFile(input);
        outputFilePath = await generateOutputFile(expectedOutput);

        console.log("Generated Files (Host Paths):");
        console.log("Code File:", filePath);
        console.log("Input File:", inputFilePath);
        console.log("Output File:", outputFilePath);

        let result;

        if (language === "cpp") {
            result = await executeCpp(filePath, inputFilePath, outputFilePath);
        } else if (language === "python") {
            result = await executePy(filePath, inputFilePath, outputFilePath);
        } else if (language === "java") {
            // NOTE: executeJava needs the original filePath, not the renamed Main.java path
            result = await executeJava(filePath, inputFilePath, outputFilePath);
        } else {
            console.error("Submit Error: Unsupported language provided.");
            return res.status(400).json({ message: "Unsupported language" });
        }

        console.log("Execution Result:", result);
        console.log("Calculated Verdict:", result.verdict);

        res.json({
            success: true,
            verdicts: [{
                status: result.verdict,
                executionTime: result.executionTimeMs,
                memoryUsed: result.memoryUsed,
                message: result.stderr,
            }],
            totalTimeMs: result.executionTimeMs,
            verdict: result.verdict,
            output: result.stdout,
            compileMessage: result.stderr.includes('SyntaxError') ? result.stderr : '',
        });
    } catch (error) {
        console.error("Submit Catch Block Error:", error);
        const message = error.message || "Compilation or Execution Error";
        const cleanError = error.stderr || message;

        res.status(500).json({
            success: false,
            message: message,
            compileMessage: cleanError,
            verdict: 'Internal Error',
            verdicts: [],
            totalTimeMs: 0,
            memoryUsed: 0,
        });
    } finally {
        if (filePath) {
            fsp.unlink(filePath).catch(err => console.error('Error deleting code file:', err));
        }
        if (inputFilePath) {
            fsp.unlink(inputFilePath).catch(err => console.error('Error deleting input file:', err));
        }
        if (outputFilePath) {
            fsp.unlink(outputFilePath).catch(err => console.error('Error deleting expected output file:', err));
        }
        // Cleanup for Java's compiled .class file needs to be added here.
        if (language === 'java') {
             const className = "Main";
             const compiledClassPath = path.join(__dirname, '..', 'outputs', `${className}.class`);
             fsp.unlink(compiledClassPath).catch(err => console.error('Error deleting Java class file:', err));
        }
    }
};

module.exports = { submit };