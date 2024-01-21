const { stdin, stdout } = require('process');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const pathToTxtFile = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(pathToTxtFile, {
  autoClose: false
});

const terminalSession = readline.createInterface({
  input: stdin,
});

stdout.write('Hello. It\'s me. Type some text:\n');

terminalSession.on('line', (line) => {
  if(line === 'exit') {
    process.emit('SIGINT');
  }
  const newLine = `${line}\n`;
  writeStream.write(newLine, 'utf-8');
});

process.on('SIGINT', () => {
  stdout.write('Bye!');
  process.exit();
});






