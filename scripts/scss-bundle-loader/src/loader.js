import path from 'path';
import fs from 'fs';
import { getOptions } from 'loader-utils';
import async from "async";

export default function loader(source) {
  const options = getOptions(this);
  const callback = this.async();
  const rootPath = this.resourcePath.replace(/[\.a-z]+$/g, "");
  const sourceWithoutTrailingSpace = source.replace(/^\s+|\s+$/g, "");
  const sourceArray = source.split('\n');

  getImportFile(rootPath, sourceArray);
  // source = source.replace(/\[name\]/g, options.name);

  // return `export default ${ JSON.stringify(scssBundle) }`;


  function getImportFile(rootPath, arrayFileImport) {
    let scssBundle = '';
    let listImportFile = [];
    for (let index = 0; index < arrayFileImport.length; index++) {
      const element = arrayFileImport[index];
      let filePath = path.resolve(rootPath + "_" + element.replace(/^(@import\s\")|\"\;|\r\n|\r|\n/g, "") + ".scss");
      listImportFile.push(filePath);
      // fs.readFile(filePath, 'utf8', function(err, data) {
      //   if (err) {
      //     debugger;
      //     throw err;
      //   }
      //   scssBundle += "\n"+data;
      // });
    }


    async.eachSeries(
      listImportFile,
      function(filename, cb) {
        fs.readFile(filename, function(err, content) {
          if (!err && err != null) {
            throw err;
          }
          scssBundle += content.toString() + '\n';

          // Calling cb makes it go to the next item.
          cb(err);
        });
      },
      // Final callback after each item has been iterated over.
      function(err) {
        callback(null, {
          source: scssBundle,
          content: scssBundle
        });
        console.log("iterated over.");
      }
    );

    // callback(null, scssBundle, null, null);
  }
  return;
};

// async.eachSeries(
//   ['css/bootstrap.css', 'css/bootstrap-responsive.css'],
//   function(filename, cb) {
//     fs.readFile(filename, function(err, content) {
//       if (!err) {
//         throw err;
//       }
//       scssBundle += content + '\n';

//       // Calling cb makes it go to the next item.
//       cb(err);
//     });
//   },
//   // Final callback after each item has been iterated over.
//   function(err) {
//     callback(null, scssBundle, null, null);
//     console.log("iterated over.");
//   }
// );