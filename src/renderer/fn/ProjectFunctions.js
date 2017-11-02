import fs from 'fs';
import path from 'path';
import cmd from 'node-cmd';
import { remote } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies


export const determineFileType = (file, sourcePathsObj) => {
  switch (path.extname(file)) {
    case '.scss':
    case '.sass':
      return sourcePathsObj.scssEntry = file; // eslint-disable-line no-return-assign
    case '.js':
      return sourcePathsObj.jsEntry = file; // eslint-disable-line no-return-assign
    default:
      return file;
  }
};


export const writeProjectConfig = (projectObj, callback) => {
  if (!fs.existsSync(remote.app.getPath('userData'))) {
    fs.mkdirSync(remote.app.getPath('userData'));
  }

  const stringifyProjectFile = projectObj => JSON.stringify({
    projectName: path.basename(projectObj.sourcePaths.projectRoot),
    sourcePaths: {
      projectRoot: projectObj.sourcePaths.projectRoot,
      jsEntry: projectObj.sourcePaths.jsEntry,
      scssEntry: projectObj.sourcePaths.scssEntry,
    },
  });

  return fs.writeFile(path.format({
    dir: remote.app.getPath('userData'),
    base: `${path.basename(projectObj.sourcePaths.projectRoot)}.config.gulp`,
  }),
  stringifyProjectFile(projectObj),
  file => callback(file));
};


export const getProjectFilesFromDisk = (callback) => {
  let projectFiles = [];
  let streamToJSON = {};

  return fs.readdir(remote.app.getPath('userData'), (err, files) => {
    projectFiles = files.filter(file => path.extname(file) === '.gulp');

    projectFiles.forEach((file) => {
      fs.readFile(path.resolve(remote.app.getPath('userData'), file), (err, contents) => {
        streamToJSON = JSON.parse(contents);
        return callback(streamToJSON);
      });
    });
  });
};


export const runGulpOnProject = (gulpOptions, jobs, gulpfile, sourcePaths, callback) => {
  const gulpCmdArgsBuilder = (gulpOptions, jobs, gulpfile, sourcePaths) =>
    `gulp --cwd ${sourcePaths.projectRoot} --gulpfile ${gulpfile} --jobs ${jobs} --scss_src ${sourcePaths.scssEntry} --css_dest ${sourcePaths.projectRoot}/dist/assets/css/ --js_src ${sourcePaths.jsEntry} --js_dest ${sourcePaths.projectRoot}/dist/assets/js/ --CSSautoprefix ${gulpOptions.CSSautoprefix} --CSSminify ${gulpOptions.CSSminify} --CSSsmaps ${gulpOptions.CSSsmaps} --JSsmaps ${gulpOptions.JSsmaps} --JSUglify ${gulpOptions.JSUglify} --JSBabel ${gulpOptions.JSBabel}`;

  cmd.get(gulpCmdArgsBuilder(gulpOptions, jobs, gulpfile, sourcePaths),
    (err, data, stderr) => callback(data, stderr),
  );
};
