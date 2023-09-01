const fs = require('fs');

export const readFiles = async (directoryPath) => {
  const fileListArray = [];

  fs.readdirSync(directoryPath).forEach((file) => {
    fileListArray.push(file);
  });

  return fileListArray;
};
