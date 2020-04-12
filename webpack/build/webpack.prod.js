const { resolve } = require("../config/util.js");
const commonConfig = require("./webpack.common.js");
const merge = require("webpack-merge");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

module.exports = merge(commonConfig, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        // 分离css样式到单独的css文件中
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  output: {
    // 入口的文件会打包在filename里面
    filename: "[name].[contenthash].js",
    path: resolve("../dist/"),
    // 未在入口中引入的包，会打包在chunkFilename里面
    chunkFilename: "[name].[contenthash].js",
  },
  // 追踪报错的真正文件
  devtool: "cheap-modul-source-map",
  optimization: {
    // TerserJSPlugin：避免js压缩失效；
    // OptimizeCSSAssetsPlugin： 压缩css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [new MiniCssExtractPlugin(), new BundleAnalyzerPlugin()],
});