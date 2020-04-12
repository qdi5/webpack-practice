const path = require("path")
const { resolve } = require("../config/util")
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
// 15.x版本的vue-loader必须引入这个plugin，不然解析不了vue文件
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin")
console.log('resolved path: \r\n',resolve("../src"));
module.exports = {
  entry: {
    app: "./src/main.js"
  },

  module: {
    rules: [
      {
        // 配置babel转义es6+为es5代码
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/"
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]-[hash:6].[ext]",
            outputPath: "images/",
            limit: 1024 * 7
          }
        }
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
                localIdentName: "[path][name]__[local]--[hash:base64:5]"
              }
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts/",
              name: "[name]-[hash:6].[ext]"
            }
          }
        ]
      },
      {
        // 获取模块的绝对路径；这里的loader只会作用于jquery
        test: require.resolve("jquery"),
        use: {
          loader: "expose-loader",
          // 将jquery挂载到window.$
          options: "$"
        }
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new VueLoaderPlugin(),
    // 将一些第三方库或插件单独打包成一个verdors.dll.js;
    // 避免每次重复打包这些基本上不修改源码的包;
    // 在build的时候，直接从下面的filepath路径，将文件复制到dist
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve("../dll/vendors.dll.js")
    })
  ],
  optimization: {
    // 去重和分离引入的相同库
    splitChunks: {
      // initial分离同步代码，async分离异步代码，all两者都分离
      chunks: "all"
    }
  },
  resolve: {
    // 默认扩展名（当文件名没有写后缀名时，默认去查找.js、.vue或.json的文件）
    extensions: [".js", ".vue", ".json"],
    // 设置路径别名
    alias: {
      "@": resolve("../src")
    }
  }
};