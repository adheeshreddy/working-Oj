const fs = require('fs'); // Use regular fs for synchronous methods
const fsp = require('fs/promises'); // Use fsp for fs.promises
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInput = path.join(__dirname, '../inputs');

if (!fs.existsSync(dirInput)) {
    fs.mkdirSync(dirInput, { recursive: true });
}

const generateInputFile = async (input) => {
    try {
        const jobId = uuid();
        const fileName = `${jobId}.txt`;
        const InputfilePath = path.join(dirInput, fileName);

        if (input !== "") {
            await fsp.writeFile(InputfilePath, input); // Use fsp for async writeFile
        }
        return InputfilePath;
    } catch (error) {
        console.error("Generate Input File Error:", error);
        throw error;
    }
};

module.exports = { generateInputFile };
