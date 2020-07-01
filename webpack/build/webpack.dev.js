const Webpack = require("webpack")
const commonConfig = require("./webpack.common.js")
const merge = require("webpack-merge")
const { resolve } = require('../config/util')
module.exports = merge(commonConfig, {
  mode: "development",
  output: {
    filename: "bundle.js",
    path: resolve("../dist/"),
  },
  // 追踪报错的真正文件
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ]
  },
  plugins: [new Webpack.HotModuleReplacementPlugin()],
  // 配置开发环境的服务器
  devServer: {
    port: 3000,
    contentBase: "./dist",
    // 默认使用浏览器打开html文件
    open: true,
    // 开启热模块更新
    hot: true,
    proxy: {
      "/api": {
        target: "http://api.wuzhe.online",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});