const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const pathToFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToFile);
readStream.setEncoding('utf8');
readStream.pipe(stdout);