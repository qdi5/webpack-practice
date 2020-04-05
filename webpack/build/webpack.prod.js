const commonConfig = require("./webpack.common.js");
const merge = require("webpack-merge");

module.exports = merge(commonConfig, {
  mode: "production",
  // 追踪报错的真正文件
  devtool: "cheap-modul-source-map",
});