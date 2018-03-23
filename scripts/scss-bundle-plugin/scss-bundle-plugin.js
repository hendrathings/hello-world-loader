var async = require('async');
var path = require('path');
var fs = require('fs');

function SCSSBundlePlugin(options) {
  this.options = options;
  this.scssBundle = '';
}

SCSSBundlePlugin.prototype.apply = function(compiler) {
  var that = this;

  fs.readFile(that.options.file, function(err, sourceBuffer) {
    if (err != undefined && err != null) {
      throw err;
    }

    var source = sourceBuffer.toString('utf8');

    compiler.plugin('emit', function(compilation, callback) {
      var rootPath = that.options.file.replace(/[\.a-z]+$/g, "");
      var sourceArray = source.split('\n');

      var listImportFile = [];
      for (var index = 0; index < sourceArray.length; index++) {
        var element = sourceArray[index];
        var filename = element.replace(/^(@import)\s(\'|\")|\'|\"|\r\n|\r|\n/g, "");
        if (filename !== '') {
          var filePath = path.resolve(rootPath + "_" + filename + "." + that.options.type);
          listImportFile.push(filePath);
        }
      }

      async.eachSeries(
        listImportFile,
        function(filename, cb) {
          fs.readFile(filename, function(err, content) {
            if (err != undefined && err != null) {
              throw err;
            }
            that.scssBundle += content.toString('utf8') + '\n';

            // Calling cb makes it go to the next item.
            cb(err);
          });
        },
        // Final callback after each item has been iterated over.
        function(err) {
          if (err != undefined && err != null) {
            throw err;
          }

          // Insert this list into the Webpack build as a new file asset:
          compilation.assets[that.options.output.name + '.' + that.options.type] = {
            source: function() {
              return that.scssBundle;
            },
            size: function() {
              return that.scssBundle.length;
            }
          };

          callback();
        }
      );
    });

  });


};

module.exports = SCSSBundlePlugin;