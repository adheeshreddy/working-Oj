const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, '..', 'codes'); 

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, code) => {
    const jobId = uuid();
    const fileName = language === "java" ? "Main.java" : `${jobId}.${language}`;
    const filePath = path.join(dirCodes, fileName);

    await fsp.writeFile(filePath, code);
    let fd;
    try {
        fd = fs.openSync(filePath, 'r+');
        fs.fsyncSync(fd);
    } finally {
        if (fd) {
            fs.closeSync(fd);
        }
    }
    
    return filePath;
};

module.exports = { generateFile };