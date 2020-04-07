const commonConfig = require("./webpack.common.js");
const merge = require("webpack-merge");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = merge(commonConfig, {
  mode: "production",
  // 追踪报错的真正文件
  devtool: "cheap-modul-source-map",
  plugins: [
    new BundleAnalyzerPlugin()
  ],
});