var path = require('path');

module.exports = {
  //entry: './js/src/main.js',
  entry:{
	  game: './js/src/main.js',
	  playerSelect: './js/src/playerSelectionScreen.js',
	  startScreen: './js/src/startscreen.js'
  },
  output: {
    filename: '[name]-bundle.js',
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
