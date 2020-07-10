const baseWebpackConfig = require("./webpack.base.config.js")
const webpack = require('webpack')
const webpackMerge = require("webpack-merge")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CONFIG = require('./config')
module.exports = webpackMerge(baseWebpackConfig, {
	mode: 'production',
	output: {
		publicPath: ''
	},
	module: {
		rules: [
			{
				test: /\.(css|less)$/,
				use: [
					 MiniCssExtractPlugin.loader,
					'css-loader',
					"postcss-loader", 
					"less-loader",
				]
			}
		]
	},
	devtool: "cheap-modul-source-map",
	optimization: {
	    // TerserJSPlugin：避免js压缩失效；
		// OptimizeCSSAssetsPlugin： 压缩css
		minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
		//
		splitChunks: {
		    // initial分离同步代码，async分离异步代码，all两者都分离
		    chunks: "all"
		}
	},
	plugins: [
		new CleanWebpackPlugin(), 
		new MiniCssExtractPlugin({
			// 使用filename可以设置入口文件里css最终的目录和文件名
			filename: `${CONFIG.DIR.STYLE}/[name].[hash:6].css`
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new BundleAnalyzerPlugin()
	]
})