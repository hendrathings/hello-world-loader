const webpack = require('webpack');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (options) {
  return webpackMerge(commonConfig({ env: ENV }), {
    entry: {

    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: path.resolve('scripts/scss-bundle-loader/loader.js'),
              options: {/* ... */}
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin()
    ],

    devtool: 'eval-source-map'
  });
}
