import fs from 'fs';
import path from 'path';
import { remote } from 'electron'; // eslint-disable-line

export const determineFileType = (file, sourcePathsObj) => {
  switch (path.extname(file)) {
    case '.scss':
    case '.sass':
      return sourcePathsObj.scssEntry = file; // eslint-disable-line
    case '.js':
      return sourcePathsObj.jsEntry = file; // eslint-disable-line
    default:
      return file;
  }
};

export const writeProjectConfig = (projectObj, callback) => {
  fs.writeFile(path.format({
    dir: remote.app.getPath('userData'),
    base: `${projectObj.projectName}.config.json`,
  }),
  JSON.stringify({
    projectName: projectObj.projectName,
    sourcePaths: {
      jsEntry: projectObj.sourcePaths.jsEntry,
      scssEntry: projectObj.sourcePaths.scssEntry,
    },
  }),
  file => callback(file)); // eslint-disable-line
};
