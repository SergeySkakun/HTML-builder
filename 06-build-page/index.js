const path = require('path');
const fs = require('fs');

const templatePath = path.join(__dirname, 'template.html');
const replaceFolderPath = path.join(__dirname, 'components');

async function readFile(path) {
  const textPromises = await fs.promises.readFile(path, { encoding: 'utf-8' });
  return textPromises;
}

function createHTML() {
  readFile(templatePath)
    .then(async (text) => {
      let newHTML = text;
      const match = text.match(/{{([a-z]+)}}/gi);

      async function replaceText(replTxt) {
        const fileName = replTxt.slice(2, -2) + '.html';
        const replacementPath = path.join(replaceFolderPath, fileName);
        const replacementText = await readFile(replacementPath);
        newHTML = newHTML.replace(replTxt, replacementText);
      }

      for (const template of match) {
        await replaceText(template);
      }

      return newHTML;
    })
    .then(async (html) => {
      const projectPath = path.join(__dirname, 'project-dist');
      const htmlFilePath = path.join(projectPath, 'index.html');

      const writeStream = fs.createWriteStream(htmlFilePath);
      writeStream.write(html);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createCSSFile() {
  const stylesPath = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

  fs.promises
    .readdir(stylesPath, { withFileTypes: true })
    .then((files) => {
      return files.filter((file) => {
        const isFile = file.isFile();
        const isCSSFile = file.name.toLocaleLowerCase().slice(-4) === '.css';
        return isFile && isCSSFile;
      });
    })
    .then((cssFiles) => {
      const writeStream = fs.createWriteStream(bundlePath);
      cssFiles.forEach(async (file) => {
        const filePath = path.join(stylesPath, file.name);
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(writeStream);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function addAssets(dest = '') {
  const srcPath = path.join(__dirname, 'assets', dest);
  const destPath = path.join(__dirname, 'project-dist', 'assets', dest);

  fs.promises.mkdir(destPath, { recursive: true });
  fs.readdir(srcPath, { withFileTypes: true }, (err, data) => {
    data.forEach((file) => {
      if (file.isDirectory()) {
        const newDest = `${dest}\\${file.name}`;
        addAssets(newDest);
      } else {
        const pathToFile = path.join(srcPath, file.name);
        const pathToCopy = path.join(destPath, file.name);
        fs.promises.copyFile(pathToFile, pathToCopy);
      }
    });
  });
}

const deleteFolder = path.join(__dirname, 'project-dist');
fs.promises
  .access(deleteFolder)
  .then(async () => {
    await fs.promises.rm(deleteFolder, { recursive: true });
    await fs.promises.mkdir(deleteFolder, { recursive: true });
  })
  .catch(() => {
    fs.promises.mkdir(deleteFolder, { recursive: true });
  })
  .then(createHTML)
  .then(createCSSFile)
  .then(addAssets);
