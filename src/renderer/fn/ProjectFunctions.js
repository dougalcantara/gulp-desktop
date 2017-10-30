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


const stringifyProjectFile = projectObj => JSON.stringify({
  projectName: projectObj.projectName,
  sourcePaths: {
    jsEntry: projectObj.sourcePaths.jsEntry,
    scssEntry: projectObj.sourcePaths.scssEntry,
  },
});


export const writeProjectConfig = (projectObj, callback) => {
  if (!fs.existsSync(remote.app.getPath('userData'))) {
    fs.mkdirSync(remote.app.getPath('userData'));
  }

  return fs.writeFile(path.format({
    dir: remote.app.getPath('userData'),
    base: `${projectObj.projectName}.config.gulp`,
  }),
  stringifyProjectFile(projectObj),
  file => callback(file));
};


export const getProjectFilesFromDisk = (callback) => {
  let projectFiles = [];
  let streamToJSON = {};

  fs.readdir(remote.app.getPath('userData'), (err, files) => {
    projectFiles = files.filter(file => path.extname(file) === '.gulp');

    projectFiles.forEach((file) => {
      fs.readFile(path.resolve(remote.app.getPath('userData'), file), (err, contents) => {
        streamToJSON = JSON.parse(contents);
        callback(streamToJSON);
      });
    });
  });
};
