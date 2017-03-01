var path = require('path');

module.exports = {
  entry: './js/src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './js/dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: ['transform-runtime'],
          presets: ['es2015']
        }
      }
    ]
  }
};
