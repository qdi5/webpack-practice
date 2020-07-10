const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const CONFIG = require('./config')
const entry = ((filepathList) => {
    let entry = {}
    filepathList.forEach(filepath => {
        const list = filepath.split(/[\/|\/\/|\\|\\\\]/g) // 斜杠分割文件目录
        const key = list[list.length - 1].replace(/\.js/g, '') // 拿到文件的 filename
        // 如果是开发环境，才需要引入 hot module
        entry[key] = process.env.NODE_ENV === 'development' ? [filepath, 'webpack-hot-middleware/client'] : filepath
    })
    return entry
})(glob.sync(resolve(__dirname, '../client/entry/*.js')))

module.exports = {
	// 打包入口文件
	entry,
	// 文件输出路径
	output: {
		// 所有输出文件的目标路径，必须是绝对路径（使用Node.js的path模块）
		path: resolve(__dirname, `../${CONFIG.DIR.DIST}`),
		// 输出解析文件的目录，url相对于html页面
		publicPath: CONFIG.PATH.PUBLIC_PATH,
		// 配置在entry里面的文件名模板
		filename: `${CONFIG.DIR.SCRIPT}/[name].bundle.js`,
		// 不在entry里的文件的代码块的文件名模板；指定在运行过程中生成的chunk在输出时的文件名称
		chunkFilename: `${CONFIG.DIR.SCRIPT}/[name].[chunkhash].js`
	},
	resolve: {
		// 配置路径别名
		alias: {
			'@': resolve(__dirname, '../client'),
			js: resolve(__dirname, '../client/js'),
			css: resolve(__dirname, '../client/css'),
			less: resolve(__dirname, '../client/less'),
			imgs: resolve(__dirname, '../client/imgs'),
			fonts: resolve(__dirname, '../client/fonts')
		}
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
				test: /\.(png|jpe?g|gif|webp)$/i,
				use: {
				  loader: "url-loader",
				  options: {
					name: "[name]-[hash:6].[ext]",
					limit: 1024 * 7,
					outputPath: CONFIG.DIR.IMAGE
				  }
				}
			},
			{
				test: /\.(woff|woff2|svg|eot|ttf)$/,
				use: [
				  {
					loader: "file-loader",
					options: {
					  name: "[name]-[hash:6].[ext]",
					  outputPath: CONFIG.DIR.FONT
					}
				  }
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							attributes: true,
							minimize: false
						}
					}
				]
			},
			{
				test: /\.ejs/,
				use: [
					{
						loader: 'html-loader',
						options: {
							attributes: true,
							// 不压缩html
							minimize: false
						}
					},
					{
						loader: 'ejs-html-loader',
						options: {
							production: process.env.NODE_ENV === 'production'
						}
					}
				]
			}
		]
	},
  optimization: {
		splitChunks: {
		    // initial分离同步代码，async分离异步代码，all两者都分离
		    chunks: "all"
		}
	},
	plugins: [
		// 生成多个html-webpack-plugin配置
		...glob.sync(resolve(__dirname, '../client/views/*.ejs')).map((filepath, i) => {
			const tempList = filepath.split(/[\/|\/\/|\\|\\\\]/g)           // 斜杠分割文件目录
			let filename = `views/${tempList[tempList.length - 1]}`       // 拿到文件的 filename
			const template = filepath                                       // 指定模板地址为对应的 ejs 视图文件路径
			const fileChunk = filename.split('.')[0].split(/[\/|\/\/|\\|\\\\]/g).pop() // 获取到对应视图文件的 chunkname
			const chunks = ['manifest', 'vendors', fileChunk]               // 组装 chunks 数组
			return new HtmlWebpackPlugin({ filename, template, chunks })    // 返回 HtmlWebpackPlugin 实例
		})
	]
}
