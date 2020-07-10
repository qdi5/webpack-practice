const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.config')
const webpackMerge = require('webpack-merge')
const { resolve, join } = require('path')
module.exports = webpackMerge(baseWebpackConfig, {
	mode: 'development',
	devtool: "cheap-module-eval-source-map",
	module: {
		rules: [
			{
				test: /\.(less|css)$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'less-loader'
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// 定义在编译时期能配置的全局变量
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	]
})