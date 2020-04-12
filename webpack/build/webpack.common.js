const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const webpack = require('webpack')

module.exports = {
  entry: {
    app: "./src/main.js",
  },
 
  module: {
    rules: [
      {
        // 配置babel转义es6+为es5代码
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]-[hash:6].[ext]",
            outputPath: "images/",
            limit: 1024 * 7,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // 使用模块化的方式使用css，避免当前组件的样式影响其他组件的样式
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts/",
              name: "[name]-[hash:6].[ext]",
            },
          },
        ],
      },
      {
        // 获取模块的绝对路径；这里的loader只会作用于jquery
        test: require.resolve("jquery"),
        use: {
          loader: "expose-loader",
          // 将jquery挂载到window.$
          options: "$",
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
  ],
  optimization: {
    // 去重和分离引入的相同库
    splitChunks: {
      // initial分离同步代码，async分离异步代码，all两者都分离
      chunks: "all"
    }
  }
};