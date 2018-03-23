import path from 'path';
import fs from 'fs';
import { getOptions, interpolateName } from 'loader-utils';
import async from "async";

export default function loader(source) {
  const options = getOptions(this);
  const callback = this.async();
  const rootPath = this.resourcePath.replace(/[\.a-z]+$/g, "");
  const sourceWithoutTrailingSpace = source.replace(/^\s+|\s+$/g, "");
  const sourceArray = source.split('\n');
  const addDependency = this.addDependency;
  const emitFile = this.emitFile;
  const that = this;
  const extFile = this.resourcePath.split('.').pop();

  getImportFile(rootPath, sourceArray, extFile);

  function getImportFile(rootPath, arrayFileImport, extFile) {
    let scssBundle = '';
    let listImportFile = [];
    for (let index = 0; index < arrayFileImport.length; index++) {
      const element = arrayFileImport[index];
      let filePath = path.resolve(rootPath + "_" + element.replace(/^(@import\s\")|\"\;|\r\n|\r|\n/g, "") + "." + extFile);
      listImportFile.push(filePath);
    }

    async.eachSeries(
      listImportFile,
      function(filename, cb) {
        addDependency(filename);
        fs.readFile(filename, function(err, content) {
          if (!err && err != null) {
            throw err;
          }
          scssBundle += content + '\n';

          // Calling cb makes it go to the next item.
          cb(err);
        });
      },
      // Final callback after each item has been iterated over.
      function(err) {
        if (!err && err != null) {
          throw err;
        }

        const url = interpolateName(that, "[hash].[ext]", {
          scssBundle,
        });
        const path = `__webpack_public_path__ + ${JSON.stringify(url)};`;
        callback(null, `export default ${ path }`);
      }
    );

  }
  return;
};