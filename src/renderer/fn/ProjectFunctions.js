import fs from 'fs';
import path from 'path';
import cmd from 'node-cmd';
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
  projectName: path.basename(projectObj.sourcePaths.projectRoot),
  sourcePaths: {
    projectRoot: projectObj.sourcePaths.projectRoot,
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

/* eslint-disable */
const gulpCmdArgsBuilder = (gulpOptions, cwd, gulpfile, sourcePaths) => {
  return `gulp --cwd ${cwd} --gulpfile ${gulpfile} --scss_src ${sourcePaths.scssEntry} --css_dest /Users/apple/webdev/dummy-gulp-target/dist/assets/css/ --autoprefix ${gulpOptions.autoprefix} --minify ${gulpOptions.minify} --smaps ${gulpOptions.smaps}`;
};
/* eslint-enable */

export const runGulpOnProject = (gulpOptions, cwd, gulpfile, sourcePaths, callback) => {
  console.log(gulpCmdArgsBuilder(gulpOptions, cwd, gulpfile, sourcePaths));
  cmd.get(gulpCmdArgsBuilder(gulpOptions, cwd, gulpfile, sourcePaths),
    (err, data, stderr) => callback(data, stderr),
  );
};
