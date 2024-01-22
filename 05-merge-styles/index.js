const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.promises.readdir(stylesPath, {withFileTypes: true})
  .then((files) => {
    return files.filter((file) => {
      const isFile = file.isFile();
      const isCSSFile = file.name.toLocaleLowerCase().slice(-4) === '.css';
      return isFile && isCSSFile;
    })
  })
  .then((cssFiles) => {
    const writeStream = fs.createWriteStream(bundlePath);
    cssFiles.forEach((file) => {
      const filePath = path.join(stylesPath, file.name);
      const readStream = fs.createReadStream(filePath);
      readStream.pipe(writeStream);
    });
  })
  .catch((err) => {
    console.log(err);
  })