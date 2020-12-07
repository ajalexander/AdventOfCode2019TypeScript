'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const sourceDirectory = path.join(__dirname, '../src');

const convertPath = (sourcePath) => {
  return sourcePath.replace('/src/', '/dist/');
};

glob(`${sourceDirectory}/**/*.txt`, null, (_, files) => {
  files.forEach(sourcePath => {
    const distPath = convertPath(sourcePath);
    // console.log(`Copying '${sourcePath}' to '${distPath}'`);
    fs.copyFileSync(sourcePath, distPath);
  });
});
