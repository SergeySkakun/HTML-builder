const path = require('path');
const fs = require('fs');

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

function reCreateDir() {
  return fs.promises.rm(destPath, {force: true, recursive: true})
        .then(createDir);
}

function createDir() {
  return fs.promises.mkdir(destPath, {recursive: true});
}

fs.promises.access(destPath)
  .then(reCreateDir, createDir)
  .then(() => {
    fs.readdir(srcPath, (err, data) => {
      data.forEach((file) => {
        const pathToFile = path.join(srcPath, file);
        const pathToCopy = path.join(destPath, file);
        fs.promises.copyFile(pathToFile, pathToCopy);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });