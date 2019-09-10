const path = require('path')

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'docs/js'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    '@material-ui/core': 'MaterialUI'
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    watchContentBase: true,
    open: true
  }
}

