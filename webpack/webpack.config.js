require('dotenv').config();
const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HoneybadgerSourceMapPlugin = require('@honeybadger-io/webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = (options) => {
  const appName = 'standup';
  const ExtractSASS = new ExtractTextPlugin(`assets/styles/${options.cssFileName}`);
  const VENDOR_LIBS = [
    'history', 'lodash', 'react', 'react-dom', 'react-ga',
    'react-helmet', 'react-redux', 'react-router',
    'react-router-redux', 'reduce-reducers', 'redux', 'redux-json-api', 'redux-thunk'
  ];

  const webpackConfig = {
    devtool: options.devtool,
    entry: {
      app: Path.resolve(__dirname, '../src/app/index'),
      vendor: VENDOR_LIBS
    },
    output: {
      path: Path.resolve(__dirname, '../dist'),
      publicPath: process.env.HOSTING_URL || '/',
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [{
        test: /.jsx?$/,
        use: 'eslint-loader',
        enforce: 'pre',
        include: Path.resolve(__dirname, '../src'),
        exclude: /node_modules/
      },
      {
        test: /.jsx?$/,
        include: Path.resolve(__dirname, '../src/app'),
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      }]
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development'),
          AGILE_FINGERTIPS: JSON.stringify(process.env.AGILE_FINGERTIPS),
          COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash())
        }
      }),
      new Webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new Webpack.ProvidePlugin({ FastClick: 'fastclick' })
    ]
  };

  if (options.isProduction) {
    webpackConfig.output.filename = 'assets/scripts/[name].[chunkhash].js';
    webpackConfig.output.publicPath = `/${appName}/`;

    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        path: process.env.HOSTING_URL ? `${process.env.HOSTING_URL}/${appName}` : `/${appName}/assets`,
        template: Path.resolve(__dirname, '../src/index.html')
      }),
      new CopyWebpackPlugin([
        {
          from: 'assets/static',
          to: 'assets/static'
        }
      ]),
      new HoneybadgerSourceMapPlugin({
        apiKey: 'f2cdc518',
        assetsUrl: `https://*.fingerti.ps/${appName}`,
        revision: gitRevisionPlugin.commithash()
      }),
      ExtractSASS,
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
      // new BundleAnalyzerPlugin()
    );

    webpackConfig.module.rules.push({
      test: /\.scss$/,
      use: ExtractSASS.extract([
        'css-loader?importLoaders=1',
        'postcss-loader?config=webpack/postcss.config.js',
        'sass-loader'
      ])
    });

    webpackConfig.module.rules.push({
      test: /\.(jpe?g|png|gif)$/,
      use: [
        {
          loader: 'file-loader',
          query: {
            limit: 40000,
            name: '/assets/static/img/[name].[hash].[ext]'
          }
        },
        'image-webpack-loader'
      ]
    });
  } else {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        path: '/assets',
        template: Path.resolve(__dirname, '../src/index.html')
      }),
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.rules.push({
      test: /\.(jpe?g|png|gif)$/,
      use: ['file-loader', 'image-webpack-loader']
    });

    webpackConfig.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader?config=webpack/postcss.config.js',
        'sass-loader'
      ]
    });

    webpackConfig.devServer = {
      contentBase: Path.resolve(__dirname, '../'),
      hot: true,
      inline: true,
      historyApiFallback: true
    };
  }

  return webpackConfig;
};
