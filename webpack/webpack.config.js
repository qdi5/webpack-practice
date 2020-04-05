const path = require('path')
function resolve(dir) {
  return path.resolve(__dirname, dir)
}
module.exports = {
  mode: "development",
  entry: {
    "app": "./app.js"
  },
  output: {
    // 修改打包后输出的目录
    // path: resolve('production'),
    filename: "bundle.js",
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
          loader: 'url-loader',
          options: {
            name: "[name]-[hash:6].[ext]",
            outputPath: "images/",
            limit: 1024 * 7
          }
        }
      }
    ],

  },
};