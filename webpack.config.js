const webpack = require('webpack');
const path = require('path');
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const SCSSBundlePlugin = require('./scripts/scss-bundle-plugin/scss-bundle-plugin.js');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (env, argv) {
  return {
    entry: [
      path.join(__dirname, 'src/index.sass')
    ],
    module: {
      rules: [
        {
          test: /\.scss$|\.sass$/,
          use: [
            {
              loader: path.resolve('scripts/scss-bundle-loader/index.js'),
              options: {
                name: '[name]-[hash].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new SCSSBundlePlugin({
        file: path.join(__dirname, 'src/index.sass'),
        type: 'sass',
        output: {
          name: '_theme'
        }
      })
    ],

    devtool: 'eval-source-map'
  };
}
