const { resolve } = require("../config/util")
module.exports = {
  mode: "production",
  entry: {
    vendors: ["vue", "jquery"]
  },
  output: {
    filename: "[name].dll.js",
    path: resolve("../dll"),
    // 通过全局变量vendors暴露出去
    library: "[name]"
  }
};