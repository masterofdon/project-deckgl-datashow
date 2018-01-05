// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const path = require('path');
const resolve = path.resolve;
const webpack = require('webpack');
const fs  = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './assets/less/ant-theme-vars.less'), 'utf8'));

const CONFIG = {
  entry: {
    app: resolve('./main.js')
  },
  devtool: 'source-map',
  // output: {
  //   path: resolve(__dirname, "./"),
  //   publicPath: "https://localhost:3030",
  //   filename: "bundle.js"
  // },
  devServer: { 
    contentBase: ['./'], 
    publicPath: '/', 
    historyApiFallback: true, 
    hot: true, 
    inline: true, 
    port: 3030, 
    proxy: { 
      "/api/**": {target:"https://10.254.157.165:30000", changeOrigin: true, secure: false} 
    } 
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react', 'stage-2']
      }
    },{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    {
      test: /\.less$/,
      use: [
        {loader: "style-loader"},
        {loader: "css-loader"},
        {loader: "less-loader",
          options: {
            modifyVars: themeVariables
          }
        }
      ]
    }]
  },
  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  ]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG;