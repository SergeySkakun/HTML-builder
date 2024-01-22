const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'secret-folder');
fs.readdir(pathToFolder, {withFileTypes: true}, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log('File name - Ext file - Size:')
    data.forEach((obj) => {
      if(obj.isFile()) {
        const filePath = path.join(obj.path, obj.name);
        fs.stat(filePath, (err, stat) => {
          let extFile = path.extname(filePath);
          const nameFile = path.basename(filePath, extFile);
          const sizeFileRoundKB = stat.size / 1000;
          extFile = extFile.slice(1);
          console.log(`${nameFile} - ${extFile} - ${sizeFileRoundKB}kB `)
        });
      }
    })
  }
});