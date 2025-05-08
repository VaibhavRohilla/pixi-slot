const testFolder = 'assets/';
const fs = require('fs');
console.log("asset...")
fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
})

