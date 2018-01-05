
/**
 * Default dev server configuration.
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');

class WebpackDevConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      devtool: 'cheap-module-source-map',
      //devtool: 'inline-source-map',
      entry: [
        'webpack-dev-server/client?http://localhost:8765/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './main.js'
      ],
      devServer: {
        contentBase: ['./frontend/public/', './'],
        publicPath: '/assets/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 8765
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"dev"'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
      ]
    };

    this.config.module.rules = this.config.module.rules.concat([
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader'
      },
      {
        test: /^.((?!cssmodule).)*\.(sass|scss)$/,
        loaders: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          { loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /^.((?!cssmodule).)*\.less$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]);

    // console.log(this.config.module.rules);
  }
}

module.exports = WebpackDevConfig;
