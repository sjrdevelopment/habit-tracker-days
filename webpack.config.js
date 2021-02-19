const path = require('path')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  {
    mode: 'development',
    entry: path.resolve(__dirname, './src/index.js'),
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'client-bundle.js',
    },
    devServer: {
      contentBase: path.resolve(__dirname, './dist'),
    },
    optimization: {
      minimize: false,
    },
  },
  {
    mode: 'development',
    target: 'node',
    externals: [nodeExternals()],
    entry: path.resolve(__dirname, 'server/server.js'),
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js'],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'server-bundle.js',
    },
    devServer: {
      contentBase: path.resolve(__dirname, './dist'),
    },
    optimization: {
      minimize: false,
    },
  },
]
